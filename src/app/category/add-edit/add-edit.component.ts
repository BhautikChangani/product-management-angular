import { Component } from '@angular/core';
import { Category, CategoryService, Response } from '../category.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToasterService } from '../../toaster.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditComponent {
  category : Category = {} as Category;
  isSubmit = false;
  type : string = '';
  constructor(private service : CategoryService, private route : ActivatedRoute, private toasterService : ToasterService, private router : Router){}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.type = 'Update';
        this.GetCategoryById(id);
      } else {
        this.type = 'Add';
      }
    }); 
  }

  BackToCategoryList(){
    this.router.navigate(['../list'], {
      relativeTo: this.route
    });
  }
  SubmitForm(form : NgForm) {
    this.isSubmit = true;
    if (form.invalid) {
      return;
    }

    if (this.type === 'Add') {
      this.service.AddCategory(this.category).subscribe((response: Response) => {
        this.toasterService.showSuccessMessage(response.message ?? "");
        this.router.navigate(['../list']);
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error.message ?? "");
      })
    } else {
      this.service.EditCategory(this.category).subscribe((response: Response) => {
        this.toasterService.showSuccessMessage(response.message ?? "");
        this.router.navigate(['../list'], {relativeTo : this.route});
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error.message ?? "");
      })
    }
  }

  GetCategoryById(id : number) {
    this.service.GetCategoryById(id).subscribe((response: Category) => {
      this.category = response;
    },
    (error) => {
      this.toasterService.showErrorMessage(error.error ?? "");
    })
  }
}
