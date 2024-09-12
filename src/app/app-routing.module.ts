import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeComponentLayoutComponent } from './Layout/authorize-component-layout/authorize-component-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path:'', loadChildren : () => import('../app/auth/auth.module').then(m => m.AuthModule),
  canActivate : [AuthGuard]}, 

  {path:'', component:AuthorizeComponentLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {path:'dashboard', component : DashboardComponent},
    {path: 'category', loadChildren : () => import('../app/category/category.module').then(m => m.CategoryModule)},
    {path: 'product', loadChildren : () => import('../app/product/product.module').then(m => m.ProductModule)}
  ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
