import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyRate} from '../models/CurrencyRate';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:8080/api/rates';

  constructor(private http: HttpClient) {}

  getRates(): Observable<CurrencyRate[]> {
    return this.http.get<CurrencyRate[]>(this.apiUrl);
  }
}
