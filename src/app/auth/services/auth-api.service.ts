import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, LoginUser, UserInfo } from '../../core/model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  readonly apiUrl: string = 'https://localhost:7037/User';
  constructor(private http: HttpClient) { }

  RegisterUser(user: User): Observable<any> {
    return this.http.post<Response>(this.apiUrl + '/CreateUser', user);
  }

  LoginUser(user: LoginUser): Observable<any> {
    return this.http.post<UserInfo>(this.apiUrl + '/LoginUser', user);
  }

}
