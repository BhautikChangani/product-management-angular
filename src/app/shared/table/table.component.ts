import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() data! : any[];
  @Input() columns! : string[];
  @Output() EditData = new EventEmitter<number>();
  @Output() DeleteData = new EventEmitter<number>();

  editElement(id : number){
    this.EditData.emit(id);
  }
  deleteElement(id : number){
    this.DeleteData.emit(id);
  }
}
