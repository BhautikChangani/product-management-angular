import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizeComponentLayoutComponent } from './Layout/unauthorize-component-layout/unauthorize-component-layout.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthorizeComponentLayoutComponent } from './Layout/authorize-component-layout/authorize-component-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path:'', component:UnauthorizeComponentLayoutComponent,
  canActivate : [AuthGuard],
  children: [
    {path: '', component: LandingPageComponent},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent}
  ]}, 

  {path:'', component:AuthorizeComponentLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {path: 'dashboard', component: DashboardComponent }
  ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
