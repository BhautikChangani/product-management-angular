import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, Pagination } from '../category/category.service';


export interface Product {
  productId?: number,
  selectedCategory?: number | string,
  productName?: string,
  productDescription?: string,
  isAvailable?: number | boolean,
  productSize?: number | string,
  serialNumber?: number,
  orderDate?: Date,
  supplierEmail?: string,
  file?: File,
  imagePath?: string
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly apiUrl = "https://localhost:7037/Product"
  constructor(private http: HttpClient) { }

  FetchData(filters: Filter): Observable<any> {
    return this.http.post<Pagination>(`${this.apiUrl}/Product`, filters);
  }

  GetProductById(id: number): Observable<any> {
    return this.http.get<Product>(`${this.apiUrl}/GetProduct?productId=${id}`)
  }

  AddProduct(product: Product): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/CreateProduct`, product)
  }

  EditProduct(product: Product): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/EditProduct`, product)
  }

  DeleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteProduct?productId=${id}`)
  }
}
