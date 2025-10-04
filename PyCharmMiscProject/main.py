import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from tensorflow.keras.models import load_model
import numpy as np
from data_fetcher import fetch_all_data
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Currency Predictor API")

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENCIES = ["USD", "EUR", "GBP", "CHF"]
WINDOW_SIZE = 30

MODELS = {}
for code in CURRENCIES:
    try:
        MODELS[code] = load_model(f"lstm_{code}.h5", compile=False)
        print(f"Załadowano model dla {code}")
    except Exception as e:
        print(f"Nie udało się załadować modelu dla {code}: {e}")

class PredictRequest(BaseModel):
    code: str
    last_rates: list[float]

class PredictResponse(BaseModel):
    code: str
    predicted_rate: float

@app.get("/")
def root():
    return {"message": "Currency Predictor API działa"}

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    model = MODELS.get(request.code)
    if not model:
        return {"code": request.code, "predicted_rate": None}

    X_input = np.array(request.last_rates).reshape(1, WINDOW_SIZE, 1)
    pred = model.predict(X_input)
    return {"code": request.code, "predicted_rate": float(pred[0][0])}

@app.post("/update")
def update_data():
    fetch_all_data()
    return {"message": "Dane odświeżone i zapisane do CSV"}

@app.get("/history/{code}")
def get_history(code: str):
    try:
        df = pd.read_csv("currency_rates.csv")
    except FileNotFoundError:
        return {
            "dates": [],
            "real": [],
            "predicted": [],
            "error": "Brak pliku currency_rates.csv – uruchom najpierw /update"
        }

    if code not in df.columns:
        return {
            "dates": [],
            "real": [],
            "predicted": [],
            "error": f"Brak danych dla {code}"
        }

    model = MODELS.get(code)
    if not model:
        return {
            "dates": [],
            "real": [],
            "predicted": [],
            "error": f"Model {code} nie jest załadowany"
        }

    try:
        df["date"] = pd.to_datetime(df["date"])
        df = df.tail(100)

        last_rates = df[code].values[-WINDOW_SIZE:]
        X_input = np.array(last_rates).reshape(1, WINDOW_SIZE, 1)
        preds = []

        for _ in range(7):
            next_val = model.predict(X_input)[0][0]
            preds.append(round(float(next_val), 4))
            last_rates = np.append(last_rates[1:], next_val)
            X_input = np.array(last_rates).reshape(1, WINDOW_SIZE, 1)

        return {
            "dates": df["date"].dt.strftime("%Y-%m-%d").tolist(),
            "real": df[code].tolist(),
            "predicted": preds
        }
    except Exception as e:
        return {
            "dates": [],
            "real": [],
            "predicted": [],
            "error": f"Błąd podczas generowania historii dla {code}: {e}"
        }

