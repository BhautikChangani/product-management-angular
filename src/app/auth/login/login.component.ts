import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginUser, AuthApiService, UserInfo } from '../auth-api.service';
import { ToasterService } from '../../toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSubmit = false;
  passwordsMatch = true;
  user : LoginUser = {} as LoginUser;

  constructor(private service : AuthApiService, private toasterService : ToasterService, private router : Router) { }
  SubmitForm(form : NgForm){
    this.isSubmit = true;
    if(form.invalid || !this.passwordsMatch){
      return;
    }
    this.service.LoginUser(this.user).subscribe(
      (response : UserInfo) => {
        this.service.SetToken(response.token);
        this.toasterService.showSuccessMessage(response.message);
        console.log(this.service.GetToken());
        this.router.navigate(['../register']);
      }, 
      (error) => {
        this.toasterService.showErrorMessage(error.error.message);
      }
    )
  }
}
