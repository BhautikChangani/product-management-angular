import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToasterService } from '../../core/toaster.service';
import { NgForm } from '@angular/forms';
import { Category, Response } from '../../core/model';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent {
  category: Category = {
    id: 0,
    categoryName: '',
    description: '',
    isAdminCategory: false
  };
  isSubmit : boolean = false;
  type: string = '';
  constructor(private service: CategoryService, private route: ActivatedRoute, private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.type = 'Update';
        this.getCategoryById(id);
      } else {
        this.type = 'Add';
      }
    });
  }

  backToCategoryList() : void {
    this.router.navigate(['../list'], {
      relativeTo: this.route
    });
  }
  submitForm(form: NgForm) : void {
    this.isSubmit = true;
    if (form.invalid) {
      return;
    }

    if (this.type === 'Add') {
        this.service.AddCategory(this.category).subscribe({
          next : (response : Response) => {
            this.toasterService.ShowSuccessMessage(response.message ?? '');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          error : (error) => {
            this.toasterService.ShowErrorMessage(error.error.message ?? '');
          }
        });
    } else {
     this.service.EditCategory(this.category).subscribe({
          next : (response : Response) => {
            this.toasterService.ShowSuccessMessage(response.message ?? '');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          error : (error) => {
            this.toasterService.ShowErrorMessage(error.error.message ?? '');
          }
        });
    }
  }

  getCategoryById(id: number) : void {
    this.service.GetCategoryById(id).subscribe({
        next : (response : Category) => {
          this.category = response;
        },
        error : (error) => {
          this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
        }
      });
  }
}
