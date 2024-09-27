import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginUser, UserInfo } from '../../core/model';
import { ToasterService } from '../../core/toaster.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthApiService } from '../services/auth-api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSubmit = false;
  passwordsMatch = true;
  user: LoginUser = {
    email: '',
    password: ''
  };

  constructor(private service: AuthService, private apiService: AuthApiService, private toasterService: ToasterService, private router: Router) { }
  submitForm(form: NgForm) : void {
    this.isSubmit = true;
    if (form.invalid || !this.passwordsMatch) {
      return;
    }
    this.apiService.LoginUser(this.user).subscribe({
      next : (response : UserInfo) => {
        this.service.SetToken(response.token);
        this.toasterService.ShowSuccessMessage(response.message);
        this.router.navigate(['/product']);
      },
      error : (error) => {
        this.toasterService.ShowErrorMessage(error.error?.message ?? 'Something went wrong');
      }
    });
  }
}