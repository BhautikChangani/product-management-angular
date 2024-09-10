import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private snackBar: MatSnackBar) { }

  showAlert(icon: 'success' | 'error' | 'info' | 'warning', title: string) {
    const snackBarConfig = {
      duration: 2000,
      panelClass: [`snack-bar-${icon}`]
    };

    this.snackBar.open(title, undefined, snackBarConfig);
  }

  showSuccessMessage(title: string, showConfirmButton: boolean = false) {
    return this.showAlert('success', title);
  }

  showErrorMessage(title: string, showConfirmButton: boolean = false) {
    return this.showAlert('error', title);
  }

  showInfoMessage(title: string, showConfirmButton: boolean = false) {
    return this.showAlert('info', title);
  }

  showWarningMessage(title: string, showConfirmButton: boolean = false) {
    return this.showAlert('warning', title);
  }
}
