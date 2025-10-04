import {Component, OnInit} from '@angular/core';
import {CurrencyRate} from '../../models/CurrencyRate';
import {CurrencyService} from '../../services/currency-service';
import {interval, switchMap} from 'rxjs';
import {CurrencyAIService, PredictRequest, PredictResponse} from '../../services/currency-aiservice';

@Component({
  selector: 'app-currency-table',
  standalone: false,
  templateUrl: './currency-table.html',
  styleUrl: './currency-table.css'
})
export class CurrencyTable implements OnInit {
  rates: CurrencyRate[] = [];
  lastRatesMap: { [code: string]: number[] } = {};
  predictions: { [code: string]: number | null } = {};

  constructor(
    private currencyService: CurrencyService,
    private aiService: CurrencyAIService
  ) {}

  ngOnInit(): void {
    this.loadRates();

    interval(600000).pipe(
      switchMap(() => this.currencyService.getRates())
    ).subscribe(data => this.updateRates(data));
  }

  loadRates() {
    this.currencyService.getRates().subscribe(data => this.updateRates(data));
  }

  updateRates(data: CurrencyRate[]) {
    this.rates = data;

    this.rates.forEach(r => {
      if (['USD','EUR','GBP','CHF'].includes(r.code)) {
        if (!this.lastRatesMap[r.code]) {
          this.lastRatesMap[r.code] = Array.from({ length: 30 }, () => r.mid);
        }
        if (this.predictions[r.code] === undefined) {
          this.predictions[r.code] = null;
        }
      }
    });
  }

  predict(rate: CurrencyRate) {
    if (!['USD','EUR','GBP','CHF'].includes(rate.code)) {
      console.warn(`Brak modelu dla ${rate.code}`);
      return;
    }

    const lastRates = this.lastRatesMap[rate.code];
    const request: PredictRequest = { code: rate.code, last_rates: lastRates };

    this.aiService.predict(request).subscribe({
      next: (res: PredictResponse) => {
        this.predictions[rate.code] = res.predicted_rate;
      },
      error: err => {
        console.error(`Błąd przy predykcji dla ${rate.code}`, err);
        this.predictions[rate.code] = null;
      }
    });
  }
}
