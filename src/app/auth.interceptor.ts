import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthApiService } from './auth/auth-api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedUrls = ['/login', '/register'];
  constructor(private authService: AuthApiService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }
    const token = localStorage.getItem('token')!;
    if (this.authService.isValidToken(token)) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
