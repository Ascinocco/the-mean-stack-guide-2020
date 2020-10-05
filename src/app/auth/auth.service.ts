import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe((data) => {
        console.log('create user data res', data);
      });
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {

  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    console.log('authData', authData);
    this.http.post<{ token: string; }>('http://localhost:3000/api/user/login', authData)
      .subscribe((data) => {
        this.token = data.token;
        this.authStatusListener.next(true);
      });
  }
}
