import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Filter, Pagination } from '../../core/model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() tableConfig!: Pagination;
  @Output() EditData = new EventEmitter<number>();
  @Output() DeleteData = new EventEmitter<number>();
  @Output() AddData = new EventEmitter();
  @Output() UpdateConfig = new EventEmitter<Filter>();
  filter: Filter = {
    activePage: 0,
    rowCount: 2,
    searchString: ''
  };
  data: any[] = [];
  totalItem: number = 0;
  pageSize: number = 2;
  searchString: string = '';
  columns: string[] = [];
  searchableColumns: { [key: string]: boolean } = {};
  selectedColumn: string | null = null;
  currentFilterValue: string = '';
  filterApplied: { [key: string]: boolean } = {};


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    if (this.tableConfig.data) {
      this.data = this.tableConfig.data;
    }
    this.totalItem = this.tableConfig.totalItem;
    this.pageSize = this.tableConfig.rowCount || 2;
    this.filter.columnConfigurations = this.tableConfig.columnData;
    if (this.tableConfig.columnData) {
      this.setColumns(this.tableConfig.columnData);
    }
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
      if (this.tableConfig.data) {
        this.data = this.tableConfig.data;
      }
      this.totalItem = this.tableConfig.totalItem;
      this.pageSize = this.tableConfig.rowCount || 2;
      this.filter.columnConfigurations = this.tableConfig.columnData;

      if (this.paginator) {
        this.paginator.pageIndex = this.tableConfig.activePage || 0;
        this.paginator.pageSize = this.tableConfig.rowCount || 2;
      }
    }
  }

  getColumnDisplayName(column: string): string | undefined {
    const columnConfig = this.filter.columnConfigurations?.find(col => col.columnNameInCamle === column || col.enumString === column);
    return columnConfig ? columnConfig.columnNameDisplay : column;
  }

  private setColumns(columnData: any[]): void {
    this.columns = columnData.filter(col => !col.isExpandable).map(col => {
      if (col.dataType === 'Enum') {
        return col.enumString;
      }
      return col.columnNameInCamle;
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


  onPageChange(event: PageEvent): void {
    this.filter.activePage = event.pageIndex;
    this.filter.rowCount = event.pageSize;
    this.UpdateConfig.emit(this.filter);
  }

  onEdit(id: number): void {
    this.EditData.emit(id);
  }
  onDelete(id: number): void {
    this.DeleteData.emit(id);
  }

  onAdd(): void {
    this.AddData.emit();
  }

  onSearchChange(searchValue: string): void {
    this.filter.searchString = searchValue;
    this.UpdateConfig.emit(this.filter);
  }

  selectColumnForFilter(column: string): void {
    this.selectedColumn = column;
    const columnConfig = this.filter.columnConfigurations?.find(col => col.columnNameInCamle === column);
    this.currentFilterValue = columnConfig?.searchValue || '';
  }

  applyFilter(): void {
    if (this.selectedColumn) {
      const columnConfig = this.filter.columnConfigurations?.find(col => col.columnNameInCamle === this.selectedColumn);
      if (columnConfig) {
        columnConfig.searchValue = this.currentFilterValue;
      } else {
        this.filter.columnConfigurations?.push({ columnNameInCamle: this.selectedColumn, searchValue: this.currentFilterValue });
      }
      this.filterApplied[this.selectedColumn] = true;
      this.UpdateConfig.emit(this.filter);
    }
  }

  clearFilter(): void {
    if (this.selectedColumn) {
      this.currentFilterValue = '';
      const columnConfig = this.filter.columnConfigurations?.find(col => col.columnNameInCamle === this.selectedColumn);
      if (columnConfig) {
        columnConfig.searchValue = '';
      }
      this.filterApplied[this.selectedColumn] = false;
      this.UpdateConfig.emit(this.filter);
    }
  }


}
