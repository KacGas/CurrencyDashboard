import requests
import pandas as pd
from datetime import date, timedelta

currencies = ["USD", "EUR", "GBP", "CHF"]
end_date = date.today()
start_date = end_date - timedelta(days=5*365)
MAX_DAYS = 367

def fetch_currency_data(code, start, end):
    url = f"https://api.nbp.pl/api/exchangerates/rates/A/{code}/{start}/{end}/?format=json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        rates = data.get("rates", [])
        return [(rate["effectiveDate"], rate["mid"]) for rate in rates]
    except requests.exceptions.HTTPError as e:
        print(f"HTTPError dla {code} ({start} - {end}): {e}")
        return []
    except Exception as e:
        print(f"Błąd pobierania {code} ({start} - {end}): {e}")
        return []

def fetch_all_data(csv_file="currency_rates.csv"):
    all_data = pd.DataFrame()

    for currency in currencies:
        print(f"Pobieranie danych dla {currency}...")
        current_start = start_date

        while current_start <= end_date:
            current_end = min(current_start + timedelta(days=MAX_DAYS-1), end_date)
            chunk = fetch_currency_data(currency, current_start, current_end)
            if chunk:
                df_chunk = pd.DataFrame(chunk, columns=["date", currency])
                df_chunk.set_index("date", inplace=True)
                if all_data.empty:
                    all_data = df_chunk
                else:
                    all_data = all_data.combine_first(df_chunk)
            current_start = current_end + timedelta(days=1)

    all_data.sort_index(inplace=True)
    all_data.to_csv(csv_file)
    print(f"Dane zapisane do {csv_file}")
    return csv_file

if __name__ == "__main__":
    fetch_all_data()
