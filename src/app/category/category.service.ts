import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Filter {
  activePage? : number,
  rowCount? : number,
  searchString? : string,
  orderDetail : OrderDetail,
  columnConfigurations : ColumnConfiguration[]
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

export interface Category {
  id? : number,
  categoryName? : string,
  description? : string,
  isAdminCategory? : boolean
}

export interface Response {
  message? : string,
  isCreated? : boolean
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  readonly apiUrl = "https://localhost:7037/Category"
  constructor(private http : HttpClient) {  }

  FetchData(filters : Filter) : Observable<any>{
    return this.http.post<Pagination>(`${this.apiUrl}/Category`, filters);
  }

  GetCategoryById(id : number) : Observable<any>{
    return this.http.get<Category>(`${this.apiUrl}/GetCategory?categoryId=${id}`)
  }

  AddCategory(category : Category) : Observable<any>{
    return this.http.post<Response>(`${this.apiUrl}/CreateCategory`, category)
  }

  EditCategory(category : Category) : Observable<any>{
    return this.http.post<Response>(`${this.apiUrl}/EditCategory`, category)
  }

  DeleteCategory(id : number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/DeleteCategory?categoryId=${id}`)
  }

  GetAllCategory() : Observable<any>{
    return this.http.get<Category[]>(`${this.apiUrl}/Category`)
  }
}
