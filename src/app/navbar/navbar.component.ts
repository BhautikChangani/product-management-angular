import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  name: string | null = null;
  isLoggedIn: boolean = false;
  isProductRoute: boolean = true;
  isCategoryRoute: boolean = false;
  constructor(private service: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.service.token.subscribe(token => {
      if (token && this.service.IsValidToken(token)){
        this.isLoggedIn = !!token;
        this.name = this.service.GetName(token);
      }
    });

  }

  navigateToProduct() : void {
    this.router.navigate(['../product']);
    this.isProductRoute = true;
  }

  navigateToCategory() : void {
    this.router.navigate(['../category']);
    this.isCategoryRoute = true;
  }

  navigateToBudgetCalculator() : void {
    this.router.navigate(['budget-calculator']);
  }

  logout() : void {
    this.name = null;
    this.isLoggedIn = false;
    this.service.Logout();
    this.router.navigate(['/login']);
  }
}
