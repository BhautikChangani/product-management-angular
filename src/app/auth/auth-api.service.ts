import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

export interface Response {
  message?: string;
}

export interface User {
  firstName: string,
  lastName: string,
  contactNumber: string,
  email: string,
  password: string,
  confirmPassword: string
}

export interface LoginUser {
  email: string,
  password: string
}

export interface UserInfo {
  id: number,
  name: string,
  token: string,
  email: string,
  isLogin: boolean,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private jwtHelper = new JwtHelperService();
  readonly apiUrl = "https://localhost:7037/User";
  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromLocalStorage());
  token = this.tokenSubject.asObservable();
  constructor(private http: HttpClient) { }

  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.tokenSubject.value !== null;
  }

  RegisterUser(user: User): Observable<any> {
    return this.http.post<Response>(this.apiUrl + '/CreateUser', user);
  }

  LoginUser(user: LoginUser): Observable<any> {
    return this.http.post<UserInfo>(this.apiUrl + '/LoginUser', user);
  }

  SetToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  GetToken(): string | null {
    return localStorage.getItem('token');
  }

  IsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return this.isValidToken(token);
  }

  GetName(token: string): string {
    if (this.isValidToken(token)) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.name;
    } else {
      return '';
    }
  }

  isValidToken(token: string): boolean {
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      this.Logout();
      return false;
    }
  }

  Logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}
