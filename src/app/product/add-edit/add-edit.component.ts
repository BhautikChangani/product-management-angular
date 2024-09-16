import { Component } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../toaster.service';
import { NgForm } from '@angular/forms';
import { Category, CategoryService, Response } from '../../category/category.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditComponent {
  product : Product = {} as Product;
  isSubmit = false;
  type : string = '';
  categories: Category[] = []; 
  selectedCategory?: number;
  constructor(private service : ProductService, private categoryService : CategoryService, private route : ActivatedRoute, private toasterService : ToasterService, private router : Router){}

  ngOnInit(): void {

    this.categoryService.GetAllCategory().subscribe((response : Category[]) => {
      this.categories = response;
    })
    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.type = 'Update';
        this.GetProductById(id);
      } else {
        this.type = 'Add';
        this.product.selectedCategory = '';
      }
    }); 
  }

  BackToProductList(){
    this.router.navigate(['../list'], {
      relativeTo: this.route
    });
  }
  SubmitForm(form : NgForm) {
    this.isSubmit = true;
    console.log(form);
    if (form.invalid) {
      console.log(this.product.productSize);
      return;
    }

    if (this.type === 'Add') {
      this.service.AddProduct(this.product).subscribe((response: Response) => {
        this.toasterService.showSuccessMessage(response.message ?? "");
        this.router.navigate(['../list'], {relativeTo : this.route});
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error.message ?? "");
      })
    } else {
      this.service.EditProduct(this.product).subscribe((response: Response) => {
        this.toasterService.showSuccessMessage(response.message ?? "");
        this.router.navigate(['../list'], {relativeTo : this.route});
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error.message ?? "");
      })
    }
  }

  GetProductById(id : number) {
    this.service.GetProductById(id).subscribe((response: Product) => {
      this.product = response;
      this.product.productSize = this.product.productSize?.toString();
      this.product.isAvailable = !Boolean(this.product.isAvailable);
      this.product.selectedCategory = this.product.selectedCategory?.toString();
      console.log(this.product);
    },
    (error) => {
      this.toasterService.showErrorMessage(error.error ?? "");
    })
  }
}
