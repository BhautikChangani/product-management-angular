import { Component } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToasterService } from '../../core/toaster.service';
import { Response, User } from '../../core/model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isSubmit : boolean = false;
  passwordsMatch : boolean = true;
  user: User = {
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string | undefined;
  successMessage: string | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private service: AuthApiService, private toasterService: ToasterService) { }


  submitForm(form: NgForm) : void {
    this.isSubmit = true;
    if (form.invalid) {
      return;
    }
    this.user.contactNumber = this.user.contactNumber.toString();
    this.service.RegisterUser(this.user).subscribe({
      next : (response : Response) => {
        this.toasterService.ShowSuccessMessage(response.message ?? '');
        this.router.navigate(['../login']);
      },
      error : (error) => {
        this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
      }
    });
  }
}
