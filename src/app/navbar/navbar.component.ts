import { Component } from '@angular/core';
import { AuthApiService } from '../auth/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  name : string | null = null;
  isLoggedIn : boolean = false;
  constructor(private service : AuthApiService, private router : Router){}

  ngOnInit(): void {
    this.service.token.subscribe(token => {
      this.isLoggedIn = !!token;
      if(token)
      this.name = this.service.GetName(token);
    });
  }

  Logout(){
    this.name = null;
    this.isLoggedIn = false;
    this.service.Logout();
    this.router.navigate(['/login']);
  }
}
