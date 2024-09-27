import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper : JwtHelperService = new JwtHelperService();
  private tokenSubject : BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getTokenFromLocalStorage());
  token = this.tokenSubject.asObservable();
  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }

  IsLoggedIn(): boolean {
    return this.tokenSubject.value !== null;
  }

  SetToken(token: string) : void {
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
    return this.IsValidToken(token);
  }

  GetName(token: string): string {
    if (this.IsValidToken(token)) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.name;
    } else {
      return '';
    }
  }

  IsValidToken(token: string): boolean {
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      this.Logout();
      return false;
    }
  }

  Logout() : void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}
