import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private snackBar: MatSnackBar) { }

  ShowAlert(icon: 'success' | 'error' | 'info' | 'warning', title: string) : void {
    const snackBarConfig = {
      duration: 2000,
      panelClass: [`snack-bar-${icon}`]
    };

    this.snackBar.open(title, undefined, snackBarConfig);
  }

  ShowSuccessMessage(title: string, showConfirmButton: boolean = false) : void {
    return this.ShowAlert('success', title);
  }

  ShowErrorMessage(title: string, showConfirmButton: boolean = false) : void {
    return this.ShowAlert('error', title);
  }

  ShowInfoMessage(title: string, showConfirmButton: boolean = false) : void {
    return this.ShowAlert('info', title);
  }

  ShowWarningMessage(title: string, showConfirmButton: boolean = false) : void {
    return this.ShowAlert('warning', title);
  }
}
