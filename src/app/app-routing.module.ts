import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { BudgetCalculatorComponent } from './budget-calculator/budget-calculator/budget-calculator.component';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthGuard]
  },
  { path: 'category', canActivate: [AuthGuard], loadChildren: () => import('../app/category/category.module').then(m => m.CategoryModule) },
  { path: 'product', canActivate: [AuthGuard], loadChildren: () => import('../app/product/product.module').then(m => m.ProductModule) },
  { path: 'budget-calculator', component : BudgetCalculatorComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
