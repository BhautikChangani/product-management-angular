import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../core/toaster.service';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../category/category.service';
import { Category, Response, Product } from '../../core/model';
import moment from 'moment';
import FileSaver, { saveAs } from 'file-saver';
import { CommonService } from '../../core/common.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class AddEditComponent {
  product: Product = {
    selectedCategory: 0,
    productName: '',
    productDescription: '',
    serialNumber: 0,
    supplierEmail: '',
    imagePath: '',
  };
  isSubmit: boolean = false;
  type: string = '';
  categories: Category[] = [];
  file: File | null = null;
  selectedCategory?: number;
  imagePath: string | null = null;
  constructor(
    private service: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private router: Router,
    private commonService : CommonService
  ) { }

  ngOnInit(): void {
    this.categoryService.GetAllCategory().subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      }
    });
    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.type = 'Update';
        this.getProductById(id);
      } else {
        this.type = 'Add';
        this.product.selectedCategory = '';
      }
    });
  }

  backToProductList(): void {
    this.router.navigate(['../list'], {
      relativeTo: this.route
    });
  }

  submitForm(form: NgForm): void {
    this.isSubmit = true;
    if (form.invalid) {
      return;
    }
    this.product.isAvailable = Number(this.product.isAvailable);

    if (this.type === 'Add') {
      this.service.AddProduct(this.product).subscribe({
        next: (response: Response) => {
          this.toasterService.ShowSuccessMessage('Product added successfully');
          this.uploadFile(this.product.productId ?? 0);
          this.router.navigate(['../list'], { relativeTo: this.route });
        },
        error: (error) => {
          this.toasterService.ShowErrorMessage('Something went wrong');
        }
      });
    } else {
      this.service.EditProduct(this.product).subscribe({
        next: (response: Response) => {
          this.toasterService.ShowSuccessMessage('Updated successfully');
          this.uploadFile(this.product.productId ?? 0);
          this.router.navigate(['../list'], { relativeTo: this.route });
        },
        error: (error) => {
          this.toasterService.ShowErrorMessage('Something went wrong');
        }
      });
    }
  }
  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  getProductById(id: number): void {
    this.service.GetProductById(id).subscribe((response: Product) => {
      this.product = response;
      this.product.productSize = this.product.productSize?.toString();
      this.product.isAvailable = !Boolean(this.product.isAvailable);
      this.product.selectedCategory = this.product.selectedCategory?.toString();
      this.product.orderDate = moment(this.product.orderDate).format('YYYY-MM-DD');
      this.imagePath = this.product.imagePath ?? null;
    },
      (error) => {
        this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
      });
  }

  deleteImage(): void {
    this.service.DeleteProductImage(this.product.productId ?? 0).subscribe((response: Response) => {
      this.router.navigate(['../list'], { relativeTo: this.route });
    },
      (error) => {
        this.toasterService.ShowErrorMessage(error.error ?? 'Something went wrong');
      });
  }

  downloadImage(): void {
    this.service.DownloadProductImage(this.product.productId ?? 0).subscribe((arrayBuffers) => {
      this.downloadImageFromByteString(arrayBuffers, `product_image_${this.product.productId}.jpg`);
    });

  }

  downloadImageFromByteString(byteString: string, filename: string) {
    const blob = this.commonService.ByteStringToBlob(byteString, filename);

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Set the desired filename

    // Append to the body
    document.body.appendChild(a);

    // Trigger the download
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Release the object URL
  }

  private uploadFile(productId: number): void {
    if (this.file) {
      this.service.UploadProductFile(productId, this.file).subscribe(
        (response) => {
          this.toasterService.ShowSuccessMessage('File uploaded successfully');
        },
        (error) => {
          this.toasterService.ShowErrorMessage('File upload failed');
        }
      );
    }
  }
}
