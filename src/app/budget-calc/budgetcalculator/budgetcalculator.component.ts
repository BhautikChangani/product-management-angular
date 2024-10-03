import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

interface BudgetRow {
  category: string;
  type: string;
  placeHolder?: string;
  categoryType?: string;
  values: (string | number | null)[];
  isParentRow? : boolean;
  categories?: Category[];
  isOpen? : boolean;
  isInputRow? : boolean;
}

interface Category {
  name: string;
  type: string,
  values: (string | number | null)[];
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
  displayedColumns1: string[] = ['categories'];
  dataSource: BudgetRow[] = [];
  incomeTotal: number[] = [];
  expenseTotal: number[] = [];
  profitLoss: number[] = [];
  openingBalance: number[] = [];
  closingBalance: number[] = [];
  isSubmit: boolean = false;
  private existingIncomeCategories: Set<string> = new Set();
  private existingExpenseCategories: Set<string> = new Set();
  selectedRow: Category | null = null;
  currentInputValue: number | null = null;
  incomeCategory: Category[] = [];
  expenseCategory: Category[] = [];

  lastAddedInputRef!: ElementRef;

  @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;

  constructor(private cdr : ChangeDetectorRef) {
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

    this.dataSource.find(x => x.category == 'Income')?.categories?.forEach(row => {
      row.values.forEach((value, index) => {
        const numValue : number = parseFloat(value as string);
        incomeTotals[index] += numValue;
      })
    });
    this.dataSource.find(x => x.category == 'Expense')?.categories?.forEach(row => {
      row.values.forEach((value, index) => {
        const numValue : number = parseFloat(value as string);
        expenseTotals[index] += numValue;
      })
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
    this.displayedColumns1 = ['categories', ...months];
    this.dataSource = [
      { category: 'Income', type: 'title', values: Array(months.length).fill(''), isParentRow : true, categories : [], isOpen : true },
      { category: 'Input', categoryType: 'income', placeHolder: 'Enter income category', type: 'title', values: Array(months.length).fill(''), isInputRow : true },
      { category: 'Income Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Expense', type: 'title', values: Array(months.length).fill(''), isParentRow : true, categories : [], isOpen : true },
      { category: 'Input', categoryType: 'expense', placeHolder: 'Enter expense category', type: 'title', values: Array(months.length).fill(''), isInputRow : true },
      { category: 'Expense Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Profit / Loss', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Opening Balance', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Closing Balance', type: 'value', values: Array(months.length).fill(0) },
    ];
    this.updateTotals();
  }

  
  openCategory(type : string){
      this.dataSource.forEach(row => {
        if(row.category == type){
          row.isOpen  = (!row.isOpen)
        }
      })
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

        this.incomeCategory.push({
          type: isIncome ? 'Income' : 'Expense',
          name : inputValue,
          values : Array(this.displayedColumns.length - 1).fill(0)
        });
        this.dataSource.find(x => x.category == (isIncome ? 'Income' : 'Expense'))?.categories?.push({
          type: isIncome ? 'Income' : 'Expense',
          name : inputValue,
          values : Array(this.displayedColumns.length - 1).fill(0)
        });

        const inputRowIndex: number = this.dataSource.indexOf(row);
        this.openCategory(isIncome ? 'Income' : 'Expense');
        this.openCategory(isIncome ? 'Income' : 'Expense');
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

  openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger, row: Category, value: number) : void {
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
      this.dataSource.find(x => x.category == this.selectedRow?.type)?.categories?.forEach(row => {
        if (row.name === this.selectedRow?.name) {
          row.values = row.values.map(() => this.currentInputValue);
        }
      });
        this.cdr.detectChanges();
      this.updateTotals();
    }
  }

  deleteCategory(row: Category) : void {
   const rowIndex = this.dataSource.find(x => x.category == row.type)?.categories?.indexOf(row);
    if(row.type === 'Income'){
      this.existingIncomeCategories.delete(row.name.toLowerCase());
    } else if (row.type === 'Expense') {
      this.existingExpenseCategories.delete(row.name.toLowerCase());
    }

    if (rowIndex !== -1) {
      this.dataSource.find(x => x.category == row.type)?.categories?.splice(Number(rowIndex), 1);
      this.dataSource = [...this.dataSource];
    }
    this.updateTotals();
    this.cdr.detectChanges();
  }

}



