import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getHistory(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/history/${code}`);
  }
}
