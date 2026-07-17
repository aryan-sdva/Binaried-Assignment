import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);

  private api = 'http://localhost:5001/api/tasks';

  getTasks(): Observable<any> {
    return this.http.get(this.api);
  }

  createTask(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  updateTask(id: string, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}