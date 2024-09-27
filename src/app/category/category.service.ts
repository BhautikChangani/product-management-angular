import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Pagination, Filter } from '../core/model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  readonly apiUrl : string = 'https://localhost:7037/Category';
  constructor(private http: HttpClient) { }

  FetchData(filters: Filter): Observable<any> {
    return this.http.post<Pagination>(`${this.apiUrl}/Category`, filters);
  }

  GetCategoryById(id: number): Observable<any> {
    return this.http.get<Category>(`${this.apiUrl}/GetCategory?categoryId=${id}`);
  }

  AddCategory(category: Category): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/CreateCategory`, category);
  }

  EditCategory(category: Category): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/EditCategory`, category);
  }

  DeleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteCategory?categoryId=${id}`);
  }

  GetAllCategory(): Observable<any> {
    return this.http.get<Category[]>(`${this.apiUrl}/Category`);
  }
}
