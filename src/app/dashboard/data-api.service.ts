import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';

export interface Filter {
  activePage? : number,
  rowCount? : number,
  searchString? : string,
  orderDetail : OrderDetail,
  columnConfiguration : ColumnConfiguration[]
}


export interface OrderDetail {
  columnName? : string,
  orderType? : string 
}

export interface ColumnConfiguration {
  columnName? : string,
  columnNameDisplay? : string,
  columnNameInCamle? : string,
  searchValue? : string,
  dataType? : string,
  enumString? : string,
  searchable? : boolean,
  isExpandable? : boolean,
  isSortable? : boolean,
  sortingType? : string,
  foreignKey? : string,
  foreignTable? : string
}

export interface Pagination {
  activePage : number,
  totalItem : number,
  data : any[],
  columnData : ColumnConfiguration[],
  initialCount : number,
  lastCount : number,
  rowCount : number,
  searchString : string,
  controller : string,
  editAction : string,
  deleteAction : string,
  formAction : string,
  isExpandable : boolean
}

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  readonly apiUrl = "https://localhost:7037"
  constructor(private http : HttpClient) {  }

  FetchData(filters : Filter, url : string) : Observable<any>{
    return this.http.post<Pagination>(this.apiUrl + url, filters);
  }

}
