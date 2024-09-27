import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, Pagination, Product } from '../core/model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly apiUrl : string = 'https://localhost:7037/Product';
  constructor(private http: HttpClient) { }

  FetchData(filters: Filter): Observable<any> {
    return this.http.post<Pagination>(`${this.apiUrl}/Product`, filters);
  }

  GetProductById(id: number): Observable<any> {
    return this.http.get<Product>(`${this.apiUrl}/GetProduct?productId=${id}`);
  }

  AddProduct(product: Product): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/CreateProduct`, product);
  }

  EditProduct(product: Product): Observable<any> {
    return this.http.post<Response>(`${this.apiUrl}/EditProduct`, product);
  }

  DeleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteProduct?productId=${id}`);
  }

  DeleteProductImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RemoveProductImage?productid=${id}`);
  }

  UploadProductFile(productId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId.toString());

    return this.http.post<Response>(`${this.apiUrl}/UploadProductFile`, formData);
  }

  DownloadProductImage(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/DownloadProductImage?productid=${productId}`);
  }
}
