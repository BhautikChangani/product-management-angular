import { Component } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}
