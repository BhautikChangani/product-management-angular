import { Component } from '@angular/core';
import { AuthApiService } from '../auth/auth-api.service';
import { DataApiService, Filter, Pagination } from './data-api.service';
import { ToasterService } from '../toaster.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  filter : Filter = {} as Filter;
  data: any[] = [];
  columns: string[] = [];

  constructor(private service : DataApiService, private toasterService : ToasterService){}

  ngOnInit(): void {
    this.FetchData("/Category/Category");
  }
  FetchData(url : string){
    this.service.FetchData(this.filter, url).subscribe((response: Pagination) => {
      console.log(response);
      this.data = response.data; 
      this.setColumns(response.columnData);
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
  }

}
