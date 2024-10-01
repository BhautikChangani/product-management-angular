import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

interface Category {
  name: string;
  type: 'income' | 'expense';
}

interface BudgetRow {
  category: string;
  type: string;
  placeHolder?: string;
  categoryType?: string;
  values: (string | number | null)[];
  categories?: Category[];
}

@Component({
  selector: 'app-budgetcalculator',
  templateUrl: './budgetcalculator.component.html',
  styleUrls: ['./budgetcalculator.component.css']
})
export class BudgetcalculatorComponent {
  startDate: string = '';
  endDate: string = '';
  minEndDate: string = '';
  errorMessage: string = '';
  displayedColumns: string[] = ['categories'];
  dataSource: BudgetRow[] = [];
  existingIncomeCategories: Set<string> = new Set();
  existingExpenseCategories: Set<string> = new Set();
  isSubmit: boolean = false;

  @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;
  selectedRow: BudgetRow = {} as BudgetRow;
  currentInputValue: number = 0;

  constructor() {
    const today: Date = new Date();
    this.minEndDate = today.toISOString().split('T')[0];
  }

  onStartDateChange(): void {
    if (this.startDate) {
      this.minEndDate = this.startDate;
    }
  }

  submitDates(): void {
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

  updateTable(): void {
    const months: string[] = this.getMonthsBetween(new Date(this.startDate), new Date(this.endDate));
    this.displayedColumns = ['categories', ...months, 'action'];
    this.dataSource = [
      { category: 'Income', type: 'title', values: Array(months.length).fill(''), categories: [] },
      { category: 'Income Input', categoryType: 'income', placeHolder: 'Enter income category', type: 'income', values: Array(months.length).fill('') },
      { category: 'Income Total', type: 'value', values: Array(months.length).fill(0), categories: [] },
      { category: 'Expense', type: 'title', values: Array(months.length).fill(''), categories: [] },
      { category: 'Expense Input', categoryType: 'expense', placeHolder: 'Enter expense category', type: 'income', values: Array(months.length).fill('') },
      { category: 'Expense Total', type: 'value', values: Array(months.length).fill(0), categories: [] },
      { category: 'Profit / Loss', type: 'value', values: Array(months.length).fill(0), categories: [] },
      { category: 'Opening Balance', type: 'value', values: Array(months.length).fill(0), categories: [] },
      { category: 'Closing Balance', type: 'value', values: Array(months.length).fill(0), categories: [] },
    ];
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

  onCategoryInput(row: BudgetRow, event: KeyboardEvent): void {
    if (event.key === 'Tab' && row.category === 'Input') {
      event.preventDefault();

      const inputValue = (event.target as HTMLInputElement).value.trim();
      if (inputValue) {
        const isIncome: boolean = row.categoryType === 'income';

        if ((isIncome && this.existingIncomeCategories.has(inputValue.toLowerCase())) ||
            (!isIncome && this.existingExpenseCategories.has(inputValue.toLowerCase()))) {
          return;
        }

        if (isIncome) {
          this.existingIncomeCategories.add(inputValue.toLowerCase());
        } else {
          this.existingExpenseCategories.add(inputValue.toLowerCase());
        }

        if (!row.categories) {
          row.categories = []; 
        }
        row.categories.push({ name: inputValue, type: isIncome ? 'income' : 'expense' });

        const newCategoryRow: BudgetRow = {
          category: inputValue,
          type: 'category',
          categoryType: isIncome ? 'income' : 'expense',
          values: Array(this.displayedColumns.length - 1).fill(0),
          categories: [] 
        };

        const inputRowIndex: number = this.dataSource.indexOf(row);
        this.dataSource.splice(inputRowIndex, 0, newCategoryRow);

        (event.target as HTMLInputElement).value = '';
        this.dataSource = [...this.dataSource]; 
        this.updateTotals();
      }
    }
  }

  updateCategoryValue(row: BudgetRow, index: number, value: number) {
    row.values[index] = value;
    this.updateTotals();
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

  reset(): void {
    this.isSubmit = false;
    this.startDate = '';
    this.endDate = '';
    this.existingIncomeCategories.clear();
    this.existingExpenseCategories.clear();
  }

  deleteCategory(row: BudgetRow): void {
    const parentRowIndex = this.dataSource.indexOf(row);
    if (parentRowIndex > -1 && row.type === 'category') {
      this.dataSource.splice(parentRowIndex, 1);
      this.dataSource = [...this.dataSource]; 
    } else {
      const parentRow = this.dataSource.find(r => r.category === (row.categoryType === 'income' ? 'Income' : 'Expense'));
      if (parentRow && parentRow.categories) {
        const categoryIndex = parentRow.categories.findIndex(c => c.name === row.category);
        if (categoryIndex > -1) {
          parentRow.categories.splice(categoryIndex, 1);
        }
      }
    }
    this.updateTotals();
  }

  updateTotals(): void {
    const incomeTotals = Array(this.displayedColumns.length - 1).fill(0);
    const expenseTotals = Array(this.displayedColumns.length - 1).fill(0);
    const profitLoss = Array(this.displayedColumns.length - 1).fill(0);
    const openingBalance = Array(this.displayedColumns.length - 1).fill(0);
    const closingBalance = Array(this.displayedColumns.length - 1).fill(0);

    this.dataSource.forEach(row => {
        if (row.type === 'category') {
            const isIncomeCategory = row.categoryType === 'income';
            const isExpenseCategory = row.categoryType === 'expense';

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


  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
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

}
