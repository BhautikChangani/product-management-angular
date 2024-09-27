import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedUrls: string[] = ['/User'];
  private counter: number = 0;
  constructor(private authService: AuthService, private loadingService: LoadingService , private router : Router) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.counter++;
    this.loadingService.startLoading();
    if (this.excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req).pipe(
        finalize(() => {
          this.counter--;
          if (this.counter === 0) {
            this.loadingService.stopLoading();
          }
        })
      );
    }
    const token = localStorage.getItem('token')!;
    if (this.authService.IsValidToken(token)) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq).pipe(
        finalize(() => {
          this.counter--;
          if (this.counter === 0) {
            this.loadingService.stopLoading();
          }
        })
      );
    } else {
      this.router.navigate(['/login']);
      this.counter--;
      this.loadingService.stopLoading();
      return new Observable<HttpEvent<any>>();
    }
  }
}
