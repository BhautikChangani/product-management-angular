import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

interface BudgetRow {
  category: string;
  type: string;
  placeHolder?: string;
  categoryType?: string;
  values: (string | number | null)[];
  categories? : Category[]
}

interface Category {
  name : string;
  type : string;
}
@Component({
  selector: 'app-budgetcalculator',
  templateUrl: './budgetcalculator.component.html',
  styleUrl: './budgetcalculator.component.css'
})
export class BudgetcalculatorComponent {
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

  constructor() {
    const today: Date = new Date();
    this.minEndDate = today.toISOString().split('T')[0];
  }

  onStartDateChange() : void {
    if (this.startDate) {
      this.minEndDate = this.startDate;
    }
  }

  submitDates() : void {
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

  updateTotals() : void {
    const incomeTotals = Array(this.displayedColumns.length - 1).fill(0);
    const expenseTotals = Array(this.displayedColumns.length - 1).fill(0);
    const profitLoss = Array(this.displayedColumns.length - 1).fill(0);
    const openingBalance = Array(this.displayedColumns.length - 1).fill(0);
    const closingBalance = Array(this.displayedColumns.length - 1).fill(0);

    this.dataSource.forEach(row => {
      if (row.type === 'category') {
        const isIncomeCategory : boolean = row.categoryType == 'income';
        const isExpenseCategory : boolean = row.categoryType == 'expense';

        row.values.forEach((value, index) => {
          const numValue : number = parseFloat(value as string);
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

  updateTable() : void {
    const months : string[] = this.getMonthsBetween(new Date(this.startDate), new Date(this.endDate));
    this.displayedColumns = ['categories', ...months, 'action'];
    this.dataSource = [
      { category: 'Income', type: 'title', values: Array(months.length).fill(''), categories:[{name: 'categ1', type: 'income'}, {name: 'categ2', type: 'income'}] },
      { category: 'Input', categoryType: 'income', placeHolder: 'Enter income category', type: 'title', values: Array(months.length).fill('') },
      { category: 'Income Total', type: 'total', values: Array(months.length).fill(0) },
      { category: 'Expense', type: 'title', values: Array(months.length).fill(''), categories:[{name: 'categ1', type: 'expense'}, {name: 'categ2', type: 'expense'}]},
      //{ category: 'Input', categoryType: 'expense', placeHolder: 'Enter expense category', type: 'title', values: Array(months.length).fill('') },
      { category: 'Expense Total', type: 'total', values: Array(months.length).fill(0) },
      { category: 'Profit / Loss', type: 'total', values: Array(months.length).fill(0) },
      { category: 'Opening Balance', type: 'total', values: Array(months.length).fill(0) },
      { category: 'Closing Balance', type: 'total', values: Array(months.length).fill(0) },
    ];
    this.updateTotals();
  }

  getMonthsBetween(startDate: Date, endDate: Date): string[] {
    const months = [];
    const currentDate: Date = new Date(startDate);
    while (currentDate <= endDate) {
      months.push(currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  }

  reset() : void {
    this.isSubmit = false;
    this.startDate = '';
    this.endDate = '';
    this.existingIncomeCategories.clear();
    this.existingExpenseCategories.clear();
  }

  onCategoryInput(row: BudgetRow, event: KeyboardEvent): void {
    if (event.key === 'Tab' && row.category === 'Input') {
      event.preventDefault();

      const inputValue = (event.target as HTMLInputElement).value.trim();
      if (inputValue) {
        const isIncome: boolean = row.categoryType === 'income';

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

        const inputRowIndex: number = this.dataSource.indexOf(row);
        this.dataSource.find(x => x.category == (isIncome ? 'income' : 'expense'))?.categories?.push({
          name : inputValue,
          type: isIncome ? 'income' : 'expense'
        } as Category);

        (event.target as HTMLInputElement).value = '';
        this.dataSource = [...this.dataSource];
        setTimeout(() => {
          setTimeout(() => {
            const newRow : HTMLTableRowElement = document.querySelectorAll('tr')[inputRowIndex + 1];
            if (newRow) {
              const inputField : Element | null = newRow.querySelector('input[type="number"]');
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

  onKeyDown(event: KeyboardEvent) : void {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger, row: BudgetRow, value: number) : void {
    event.preventDefault();

    this.contextMenuTrigger = menuTrigger;
    this.selectedRow = row;
    this.currentInputValue = value;

    menuTrigger.openMenu();

     const inputElement = event.target as HTMLElement;
    const rect = inputElement.getBoundingClientRect();

    setTimeout(() => {
        const overlay = document.querySelector('.cdk-overlay-connected-position-bounding-box') as HTMLElement;
        if (overlay) {
            overlay.style.left = `${rect.left}px`;
            overlay.style.top = `${rect.bottom}px`; 
        }
    }, 0);
}


  applyAll() : void {
    if (this.selectedRow && this.currentInputValue !== null) {
      this.dataSource.forEach(row => {
        if (row.category === this.selectedRow?.category) {
          row.values = row.values.map(() => this.currentInputValue);
        }
      });
      this.updateTotals();
    }
  }

  deleteCategory(row: BudgetRow) : void {
    const rowIndex = this.dataSource.indexOf(row);
    if(row.categoryType === 'income'){
      this.existingIncomeCategories.delete(row.category.toLowerCase());
    } else if (row.categoryType === 'expense') {
      this.existingExpenseCategories.delete(row.category.toLowerCase());
    }
    if (rowIndex !== -1) {
      this.dataSource.splice(rowIndex, 1);
      this.dataSource = [...this.dataSource];
    }
    this.updateTotals();
  }


}
