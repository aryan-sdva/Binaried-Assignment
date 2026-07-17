import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private api = 'http://localhost:5001/api/auth';

  register(data:any): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data:any): Observable<any> {
    return this.http.post(`${this.api}/login`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/profile`);
  }

}