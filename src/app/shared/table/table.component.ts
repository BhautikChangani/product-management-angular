import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Filter, Pagination } from '../../category/category.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() tableConfig! : Pagination;
  @Output() EditData = new EventEmitter<number>();
  @Output() DeleteData = new EventEmitter<number>();
  @Output() AddData = new EventEmitter();
  @Output() UpdateConfig = new EventEmitter<Filter>();
  filter : Filter = {} as Filter;
  data : any[] = [];
  totalItem : number = 0;
  pageSize : number = 2;
  searchString : string = '';
  columns : string[] = [];
  searchableColumns: { [key: string]: boolean } = {};
  filterValues: { [key: string]: string } = {};
  filtersVisible: { [key: string]: boolean } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.data = this.tableConfig.data;
    this.totalItem = this.tableConfig.totalItem;
    this.pageSize = this.tableConfig.rowCount || 2;
    this.filter.columnConfigurations = this.tableConfig.columnData;
    this.setColumns(this.tableConfig.columnData);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableConfig'] && this.tableConfig) {
      this.data = this.tableConfig.data;
      this.totalItem = this.tableConfig.totalItem;
      this.pageSize = this.tableConfig.rowCount || 2;
      this.filter.columnConfigurations = this.tableConfig.columnData;
      
      if (this.paginator) {
        this.paginator.pageIndex = this.tableConfig.activePage || 0;
        this.paginator.pageSize = this.tableConfig.rowCount || 2;
      }
    }
  }

  private setColumns(columnData: any[]): void {
    console.log(columnData);
    this.columns = columnData.filter(col => !col.isExpandable).map(col => {
      if(col.dataType == "Enum"){
        return col.enumString
      }
      return col.columnNameInCamle
    });
    if (!this.columns.includes('actions')) {
      this.columns.push('actions');
    }
    
    this.searchableColumns = columnData.reduce((searchableCol, col) => {
      if (col.searchable) {
        searchableCol[col.columnNameInCamle] = true;
      }
      return searchableCol;
    }, {} as { [key: string]: boolean });
    
  }

  onPageChange(event: PageEvent) {
    this.filter.activePage = event.pageIndex;
    this.filter.rowCount = event.pageSize;
    this.UpdateConfig.emit(this.filter);
  }

  editElement(id : number){
    this.EditData.emit(id);
  }
  deleteElement(id : number){
    this.DeleteData.emit(id);
  }

  addElement() {
    this.AddData.emit();
  }

  onSearchChange(searchValue: string) {
    this.filter.searchString = searchValue;
    this.UpdateConfig.emit(this.filter);
  }

  toggleFilter(column: string) {
    this.filtersVisible[column] = !this.filtersVisible[column];
  }

  applyFilter(column: string){
    this.toggleFilter(column);
  }

  clearFilter(column: string) {
    this.toggleFilter(column);
  }

  
}
