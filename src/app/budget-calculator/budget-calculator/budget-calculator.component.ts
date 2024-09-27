import { Component, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

interface BudgetRow {
  category: string;
  type: string;
  placeHolder?: string;
  values: (string | number | null)[];
}
@Component({
  selector: 'app-budget-calculator',
  templateUrl: './budget-calculator.component.html',
  styleUrls: ['./budget-calculator.component.css']
})
export class BudgetCalculatorComponent {
  startDate: string = '';
  endDate: string = '';
  minEndDate: string = '';
  errorMessage: string = '';
  displayedColumns: string[] = ['categories'];
  dataSource: BudgetRow[] = [];
  incomeTotal: number[] = [];
  expenseTotal: number[] = [];
  profitLoss: number[] = [];
  openingBalance: number[] = [];
  closingBalance: number[] = [];
  isSubmit: boolean = false;
  private existingIncomeCategories: Set<string> = new Set();
  private existingExpenseCategories: Set<string> = new Set();
  selectedRow: BudgetRow | null = null; 
  currentInputValue: number | null = null;


  @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;
 
  constructor(private cdr: ChangeDetectorRef) {
    const today = new Date();
    this.minEndDate = today.toISOString().split('T')[0];
  }

  onStartDateChange() {
    if (this.startDate) {
      this.minEndDate = this.startDate;
    }
  }

  submitDates() {
    this.errorMessage = '';

    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Enter a valid time period';
      return;
    }
    if (new Date(this.startDate) >= new Date(this.endDate)) {
      this.errorMessage = 'The "Start Date" must be less than the "End Date".';
      return;
    }

    this.isSubmit = true;
    this.updateTable();
  }

  updateTable() {
    const months = this.getMonthsBetween(new Date(this.startDate), new Date(this.endDate));
    this.displayedColumns = ['categories', ...months, 'action']; 
    this.dataSource = [
      { category: 'Income', type: 'title', values: Array(months.length).fill('') },
      { category: 'Input', placeHolder: 'Enter income category', type: 'title', values: Array(months.length).fill('') },
      { category: 'Income Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Expense', type: 'title', values: Array(months.length).fill('') },
      { category: 'Input', placeHolder: 'Enter expense category', type: 'title', values: Array(months.length).fill('') },
      { category: 'Expense Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Profit /Loss', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Opening Balance', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Closing Balance', type: 'value', values: Array(months.length).fill(0) },
    ];
  }
  

  getMonthsBetween(startDate: Date, endDate: Date): string[] {
    const months = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      months.push(currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  }

  


  reset() {
    this.isSubmit = false;
    this.startDate = '';
    this.endDate = '';
    this.existingIncomeCategories.clear();
    this.existingExpenseCategories.clear();
  }

  onCategoryInput(row: BudgetRow, event: KeyboardEvent) {
    if (event.key === 'Tab' && row.category === 'Input') {
        event.preventDefault();

        const inputValue = (event.target as HTMLInputElement).value.trim();
        if (inputValue) {
            if (this.existingIncomeCategories.has(inputValue.toLowerCase())) {
                return;
            }
            this.existingIncomeCategories.add(inputValue.toLowerCase());

            const inputRowIndex = this.dataSource.indexOf(row);
            this.dataSource.splice(inputRowIndex, 0, {
                category: inputValue,
                type: 'category',
                values: Array(this.displayedColumns.length - 1).fill(0)
            });

            (event.target as HTMLInputElement).value = '';

            this.dataSource = [...this.dataSource];
            this.cdr.detectChanges();
        }
    }
}

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger, row: BudgetRow, value: number) {
    event.preventDefault(); 
    this.contextMenuTrigger = menuTrigger;
    menuTrigger.openMenu();
    this.selectedRow = row; 
    this.currentInputValue = value; 
}

applyAll() {
  if (this.selectedRow && this.currentInputValue !== null) {
      this.selectedRow.values = this.selectedRow.values.map(() => this.currentInputValue); 
  }
}

deleteCategory(row: BudgetRow) {
  const rowIndex = this.dataSource.indexOf(row);
  if (rowIndex !== -1) {
    this.dataSource.splice(rowIndex, 1);
    this.dataSource = [...this.dataSource];
    this.cdr.detectChanges(); 
  }
}


}



