import { Component } from '@angular/core';
import { Category, CategoryService, Filter, Pagination } from '../category.service';
import { ToasterService } from '../../toaster.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  filter : Filter = {} as Filter;
  data: any[] = [];
  columns: string[] = [];

  constructor(private service : CategoryService, private toasterService : ToasterService, private router : Router, private route : ActivatedRoute){}
  ngOnInit(): void {
    this.FetchData();
  }

  FetchData(){
      this.service.FetchData(this.filter).subscribe((response: Pagination) => {
        this.data = response.data; 
        this.setColumns(response.columnData);
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
    private setColumns(columnData: any[]): void {
        this.columns = columnData.filter(col => !col.isExpandable).map(col => {
          if(col.dataType == "Enum"){
            return col.enumString
          }
          return col.columnNameInCamle
        });
        if (!this.columns.includes('actions')) {
          this.columns.push('actions');
        }
      }
}
