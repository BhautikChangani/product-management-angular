import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService : AuthApiService, private router : Router) {  }
  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot): boolean {
    if (this.authService.IsAuthenticated()) {
      if(this.isPublicRoute(state.url)){
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    } else {
      if(this.isPublicRoute(state.url)){
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }

  isPublicRoute(url : string) : boolean{
    const publicRoute = ['/', '/login', '/register'];
    return publicRoute.includes(url);
  }
}
