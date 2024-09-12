import { Component } from '@angular/core';
import { ToasterService } from '../toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  constructor( private toasterService : ToasterService, private router : Router){}

  FetchData(path : string){
    this.router.navigate([`/${path}`]);
  }
  

}
