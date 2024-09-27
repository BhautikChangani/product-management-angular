import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Filter, Pagination } from '../core/model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<Pagination> {

  constructor(private dataService : ProductService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pagination> {
    const filters = {
      activePage: 0,
      rowCount: 2,
      searchString: ''
    };
    return this.dataService.FetchData(filters);
  }
}
