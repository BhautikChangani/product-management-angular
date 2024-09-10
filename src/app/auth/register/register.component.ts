import { Component } from '@angular/core';
import { User, AuthApiService } from '../auth-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToasterService } from '../../toaster.service';
import { Response } from '../auth-api.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isSubmit = false;
  passwordsMatch = true;
  user : User = {} as User;
  errorMessage: string | undefined;
  successMessage: string | undefined;

  constructor(private router : Router, private route : ActivatedRoute, private service : AuthApiService, private toasterService : ToasterService) { }

  SubmitForm(form : NgForm) {
    this.isSubmit = true;
    this.passwordsMatch = this.user.password === this.user.confirmPassword;
    if(form.invalid || !this.passwordsMatch){
      return;
    }
    this.user.contactNumber = this.user.contactNumber.toString();
    this.service.RegisterUser(this.user).subscribe(
      (response: Response) => {
        this.toasterService.showSuccessMessage(response.message ?? "");
        this.router.navigate(['../login']);
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error.message ?? "");
      }
    );
  }
}
