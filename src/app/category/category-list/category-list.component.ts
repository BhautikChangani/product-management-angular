import { Component, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../category.service';
import { ToasterService } from '../../core/toaster.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Filter, Pagination } from '../../core/model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {

  filter: Filter = {
    activePage: 0,
    rowCount: 2,
    searchString: ''
  };
  columns: string[] = [];
  tableConfig: Pagination = {
    activePage: 0,
    totalItem: 0,
    initialCount: 0,
    lastCount: 0,
    rowCount: 2,
    searchString: ''
  };

  constructor(private service: CategoryService, private toasterService: ToasterService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.tableConfig = data['categories'];
    });
  }

  getAllCategory() : void {
    this.service.FetchData(this.filter).subscribe({
        next : (response : Pagination) => {
          this.tableConfig = response;
        },
        error : (error) => {
          this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
        }
      });
  }

  onEdit(id: number) : void {
    this.router.navigate(['../detail'], {
      relativeTo: this.route,
      queryParams: { id },
    });
  }

  onDelete(id: number) : void {
    this.service.DeleteCategory(id).subscribe({
        next : () => {
          this.getAllCategory();
        },
        error : (error) => {
          this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
        }
      });
  }

  onUpdateConfig(newFilter: Filter) : void {
    this.filter = newFilter;
    this.getAllCategory();
  }

  onAdd() : void {
    this.router.navigate(['../detail'], {
      relativeTo: this.route
    });
  }

}
