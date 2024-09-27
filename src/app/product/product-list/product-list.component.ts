import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../product.service';
import { ToasterService } from '../../core/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Filter, Pagination } from '../../core/model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
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

  constructor(
    private service: ProductService,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.tableConfig = data['categories'];
    });
  }

  getAllProduct() : void {
    this.service.FetchData(this.filter).subscribe({
      next: (response) => {
        this.tableConfig = response;
      },
      error: (error) => {
        this.toasterService.ShowErrorMessage(error.error ?? '');
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
    this.service.DeleteProduct(id).subscribe(() => {
      this.getAllProduct();
    },
      (error) => {
        this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
      });
  }

  onUpdateConfig(newFilter: Filter) : void {
    this.filter = newFilter;
    this.getAllProduct();
  }

  onAdd() : void {
    this.router.navigate(['../detail'], {
      relativeTo: this.route
    });
  }
}