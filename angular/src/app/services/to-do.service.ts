import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Work } from 'src/app/models/work';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient
  ) { }

  addWork(work: Work): Observable<any> {
    return this.http.post<any>('/api/works', work, {headers: this.headers}).pipe();
  }

  getWorks(): Observable<Work[]> {
    return this.http.get<Work[]>('/api/works', {headers: this.headers}).pipe();
  }

  getWork(_id: string): Observable<Work> {
    return this.http.get<Work>(`/api/works/${_id}`, {headers: this.headers}).pipe();
  }

  updateWork(_id: string, work: Work): Observable<Work> {
    return this.http.put<Work>(`/api/works/${_id}`, work, {headers: this.headers}).pipe();
  }

  removeWork(_id: string): Observable<any> {
    return this.http.delete(`/api/works/${_id}`, {headers: this.headers}).pipe();
  }

}
