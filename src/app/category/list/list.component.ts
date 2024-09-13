import { Component } from '@angular/core';
import { Category, CategoryService, Filter, Pagination } from '../category.service';
import { ToasterService } from '../../toaster.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  filter : Filter = {} as Filter;
  columns: string[] = [];
  tableConfig : Pagination = {} as Pagination;

  constructor(private service : CategoryService, private toasterService : ToasterService, private router : Router, private route : ActivatedRoute, private cdr : ChangeDetectorRef){}
  ngOnInit(): void {
    this.FetchData();
  }

  FetchData(){
      this.service.FetchData(this.filter).subscribe((response: Pagination) => {
        this.tableConfig = response;
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error ?? "");
      })
    }

    onEditData(id : number){
      this.router.navigate(['../detail'], {
        relativeTo: this.route,
        queryParams: { id: id },
      });
    }

    onDeleteData(id : number){
      this.service.DeleteCategory(id).subscribe((response: any) => {
        this.FetchData();
      },
      (error) => {
        this.toasterService.showErrorMessage(error.error ?? "");
      })
    }

    onUpdateConfig(newFilter : Filter){
        this.filter = newFilter;
        this.FetchData();
    }

    onAddData(){
      this.router.navigate(['../detail'], {
        relativeTo: this.route
      });
    }
   
}
