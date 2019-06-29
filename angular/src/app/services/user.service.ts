import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authToken: string = null;
  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient
  ) { }

  private loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  registerUser(user: {userid: string, email: string, password: string}) {
    return this.http.post<any>('/api/users', user, {headers: this.headers}).pipe();
  }

  loggedIn(): boolean {
    this.loadToken();
    return this.authToken != null;
  }

  getToken(): string {
    this.loadToken();
    return this.authToken;
  }

  authenticateUser(user: {userid: string, password: string}) {
    return this.http.post('/api/users/authenticate', user, {headers: this.headers}).pipe();
  }

  storeUserData(token: string) {
    localStorage.setItem('id_token', token);
    this.authToken = token;
  }

  getProfile(): Observable<User> {
    return this.http.get<User>('/api/users/profile', {headers: this.headers}).pipe();
  }

  logout() {
    this.authToken = null;
    localStorage.clear();
  }

}
