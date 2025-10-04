import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface PredictRequest {
  code: string;
  last_rates: number[];
}

export interface PredictResponse {
  code: string;
  predicted_rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyAIService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  predict(request: PredictRequest): Observable<PredictResponse> {
    return this.http.post<PredictResponse>(`${this.apiUrl}/predict`, request);
  }
}
