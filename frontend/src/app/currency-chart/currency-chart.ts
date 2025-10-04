import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CurrencyAIService } from '../services/currency-aiservice';
import { CurrencyRate } from '../models/CurrencyRate';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currency-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currency-chart.html',
  styleUrls: ['./currency-chart.css']
})
export class CurrencyChart implements OnInit {
  @Input() rate!: CurrencyRate;
  chart!: Chart;

  constructor(private http: HttpClient, private aiService: CurrencyAIService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    const url = `http://127.0.0.1:8000/history/${this.rate.code}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.error) {
          console.warn(res.error);
          return;
        }

        const labels = [...res.dates, ...res.predicted.map((_: number, i: number) => `+${i + 1}`)];
        const realData = res.real;
        const predictedData = Array(res.real.length - 1).fill(null).concat(res.predicted);

        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Rzeczywiste',
              data: realData,
              borderColor: 'blue',
              backgroundColor: 'transparent',
              tension: 0.3
            },
            {
              label: 'Prognoza',
              data: predictedData,
              borderColor: 'red',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        };

        const config: ChartConfiguration = {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' }
            }
          }
        };

        if (this.chart) {
          this.chart.destroy();
        }

        Chart.register(...registerables);
        this.chart = new Chart(`chart-${this.rate.code}`, config);
      },
      error: (err) => console.error('Błąd pobierania historii', err)
    });
  }
}
