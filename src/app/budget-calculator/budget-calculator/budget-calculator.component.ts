import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

interface BudgetRow {
  category: string;
  type: string;
  placeHolder?: string;
  categoryType?: string;
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

  lastAddedInputRef!: ElementRef;

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

  updateTotals() {
    const incomeTotals = Array(this.displayedColumns.length - 1).fill(0);
    const expenseTotals = Array(this.displayedColumns.length - 1).fill(0);
    const profitLoss = Array(this.displayedColumns.length - 1).fill(0);
    const openingBalance = Array(this.displayedColumns.length - 1).fill(0);
    const closingBalance = Array(this.displayedColumns.length - 1).fill(0);

    this.dataSource.forEach(row => {
      if (row.type === 'category') {
        const isIncomeCategory = row.categoryType == 'income';
        const isExpenseCategory = row.categoryType == 'expense';

        row.values.forEach((value, index) => {
          const numValue = parseFloat(value as string);
          if (!isNaN(numValue)) {
            if (isIncomeCategory) {
              incomeTotals[index] += numValue;
            } else if (isExpenseCategory) {
              expenseTotals[index] += numValue;
            }
          }
        });
      }
    });

    this.dataSource.forEach(row => {
      if (row.category === 'Income Total') {
        row.values = incomeTotals;
      } else if (row.category === 'Expense Total') {
        row.values = expenseTotals;
      } else if (row.category === 'Profit / Loss') {
        profitLoss.forEach((_, index) => {
          profitLoss[index] = incomeTotals[index] - expenseTotals[index];
        });
        row.values = profitLoss;
      }
    });

    openingBalance[0] = 0;
    for (let i = 0; i < closingBalance.length; i++) {
      if (i === 0) {
        closingBalance[i] = openingBalance[i] + profitLoss[i];
      } else {
        openingBalance[i] = closingBalance[i - 1];
        closingBalance[i] = openingBalance[i] + profitLoss[i];
      }
    }

    this.dataSource.forEach(row => {
      if (row.category === 'Opening Balance') {
        row.values = openingBalance;
      } else if (row.category === 'Closing Balance') {
        row.values = closingBalance;
      }
    });
  }





  updateTable() {
    const months = this.getMonthsBetween(new Date(this.startDate), new Date(this.endDate));
    this.displayedColumns = ['categories', ...months, 'action'];
    this.dataSource = [
      { category: 'Income', type: 'title', values: Array(months.length).fill('') },
      { category: 'Input', categoryType: 'income', placeHolder: 'Enter income category', type: 'title', values: Array(months.length).fill('') },
      { category: 'Income Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Expense', type: 'title', values: Array(months.length).fill('') },
      { category: 'Input', categoryType: 'expense', placeHolder: 'Enter expense category', type: 'title', values: Array(months.length).fill('') },
      { category: 'Expense Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Profit / Loss', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Opening Balance', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Closing Balance', type: 'value', values: Array(months.length).fill(0) },
    ];
    this.updateTotals();
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
        const isIncome = row.categoryType === 'income';

        if (isIncome) {
          if (this.existingIncomeCategories.has(inputValue.toLowerCase())) {
            return;
          }
          this.existingIncomeCategories.add(inputValue.toLowerCase());
        } else {
          if (this.existingExpenseCategories.has(inputValue.toLowerCase())) {
            return;
          }
          this.existingExpenseCategories.add(inputValue.toLowerCase());
        }

        const inputRowIndex = this.dataSource.indexOf(row);
        this.dataSource.splice(inputRowIndex, 0, {
          category: inputValue,
          type: 'category',
          categoryType: isIncome ? 'income' : 'expense',
          values: Array(this.displayedColumns.length - 1).fill(0)
        });

        (event.target as HTMLInputElement).value = '';
        this.dataSource = [...this.dataSource];
        this.cdr.detectChanges();
        setTimeout(() => {
          setTimeout(() => {
            const newRow = document.querySelectorAll('tr')[inputRowIndex + 1];
            if (newRow) {
              const inputField = newRow.querySelector('input[type="number"]');
              if (inputField instanceof HTMLInputElement) {
                inputField.focus();
              }
            }
          }, 0);
        }, 0);
        this.updateTotals();
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
    this.selectedRow = row;
    this.currentInputValue = value;

    menuTrigger.openMenu();

    setTimeout(() => {
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      if (overlay) {
        overlay.style.left = `${event.clientX}px`;
        overlay.style.top = `${event.clientY}px`;
      }
    }, 0);
  }




  applyAll() {
    if (this.selectedRow && this.currentInputValue !== null) {
      this.dataSource.forEach(row => {
        if (row.category === this.selectedRow?.category) {
          row.values = row.values.map(() => this.currentInputValue);
        }
      });
      this.updateTotals();
    }
  }


  deleteCategory(row: BudgetRow) {
    const rowIndex = this.dataSource.indexOf(row);
    if (rowIndex !== -1) {
      this.dataSource.splice(rowIndex, 1);
      this.dataSource = [...this.dataSource];
      this.cdr.detectChanges();
    }
    this.updateTotals();
  }


}



