import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

interface BudgetRow {
  category: string;
  type: string;
  placeHolder?: string;
  categoryType?: string;
  values: (string | number | null)[];
  isParentRow?: boolean;
  categories?: Category[];
  isOpen?: boolean;
  isInputRow?: boolean;
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
  lastAddedInnerCategoryIndex: number | null = null;
  pressedKeys: Set<string> = new Set();
  isControlPressed : boolean = false;

  @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;
  @ViewChildren('categoryInput') inputRefs!: QueryList<ElementRef>;

  constructor(private cdr: ChangeDetectorRef) {
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

  updateTotals(): void {
    const incomeTotals = Array(this.displayedColumns.length - 1).fill(0);
    const expenseTotals = Array(this.displayedColumns.length - 1).fill(0);
    const profitLoss = Array(this.displayedColumns.length - 1).fill(0);
    const openingBalance = Array(this.displayedColumns.length - 1).fill(0);
    const closingBalance = Array(this.displayedColumns.length - 1).fill(0);

    this.dataSource.find(x => x.category == 'Income')?.categories?.forEach(row => {
      row.values.forEach((value, index) => {
        const numValue: number = parseFloat(value as string);
        incomeTotals[index] += numValue;
      })
    });
    this.dataSource.find(x => x.category == 'Expense')?.categories?.forEach(row => {
      row.values.forEach((value, index) => {
        const numValue: number = parseFloat(value as string);
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

  updateTable(): void {
    const months: string[] = this.getMonthsBetween(new Date(this.startDate), new Date(this.endDate));
    this.displayedColumns = ['symbol','categories', ...months, 'action'];
    this.displayedColumns1 = ['categories', ...months];
    this.dataSource = [
      { category: 'Income', type: 'title', values: Array(months.length).fill(''), isParentRow: true, categories: [], isOpen: true },
      { category: 'Input', categoryType: 'income', placeHolder: 'Enter income category', type: 'title', values: Array(months.length).fill(''), isInputRow: true },
      { category: 'Income Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Expense', type: 'title', values: Array(months.length).fill(''), isParentRow: true, categories: [], isOpen: true },
      { category: 'Input', categoryType: 'expense', placeHolder: 'Enter expense category', type: 'title', values: Array(months.length).fill(''), isInputRow: true },
      { category: 'Expense Total', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Profit / Loss', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Opening Balance', type: 'value', values: Array(months.length).fill(0) },
      { category: 'Closing Balance', type: 'value', values: Array(months.length).fill(0) },
    ];
    this.updateTotals();
  }


  openCategory(type: string) {
    this.dataSource.forEach(row => {
      if (row.category == type) {
        row.isOpen = (!row.isOpen)
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

  reset(): void {
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
          name: inputValue,
          values: Array(this.displayedColumns.length - 1).fill(0)
        });
        const categoryList = this.dataSource.find(x => x.category == (isIncome ? 'Income' : 'Expense'))?.categories || [];
        this.dataSource.find(x => x.category == (isIncome ? 'Income' : 'Expense'))!.categories = [
          ...categoryList,
          {
            type: isIncome ? 'Income' : 'Expense',
            name: inputValue,
            values: Array(this.displayedColumns.length - 1).fill(0)
          }
        ];
        (event.target as HTMLInputElement).value = '';
        const categoryCount = this.dataSource.find(x => x.category == (isIncome ? 'Income' : 'Expense'))!.categories?.length || 0;
      const focusIndex = (categoryCount - 1) * (this.displayedColumns.length - 3);

      setTimeout(() => {
        setTimeout(() => {
          const categoryRow = this.dataSource.find(x => x.category === (isIncome ? 'Income' : 'Expense'));
          const rowIndex = this.dataSource.indexOf(categoryRow!);
          const rows = document.querySelectorAll('.parentRow');
          const newRow = rows[isIncome ? 0 : 3]

          if (newRow) {
            const inputField: Element | null = newRow.querySelectorAll('input[type="number"]')[focusIndex];
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

  onKeyUp(event : KeyboardEvent){
    if(!event.ctrlKey){
      this.isControlPressed = false;
      this.pressedKeys.clear();
    } else if(this.isControlPressed){
      this.pressedKeys.add('Control');
    }
    this.pressedKeys.delete(event.key);
  }

  onCtrlEnter(event : KeyboardEvent, index : number, category : Category){
    this.pressedKeys.add(event.key);
    if(event.ctrlKey){
      this.isControlPressed = true;
      this.pressedKeys.add('Control');
    }
    if(event.ctrlKey && event.key === 'Enter'){
      if(this.pressedKeys.size == 2 && this.isControlPressed){
        this.focusInput(category,'forward', index);
      }
    }
    if(event.shiftKey && event.ctrlKey && event.key === 'Enter'){
      if(this.pressedKeys.size == 3){
        this.focusInput(category,'back', index);
      }
    }
  }

  focusInput( category : Category, direction : string, index : number){
    const isIncome = category.type == 'Income' ? true : false;
    const rowIndex = this.dataSource.find(x => x.category === (isIncome ? 'Income' : 'Expense'))?.categories?.indexOf(category);
    const rows = document.querySelectorAll('.parentRow');
    const focusIndex = (Number(rowIndex) + (direction === 'forward' ? 1 : (-1))) * (this.displayedColumns.length - 3);
    const newRow = rows[isIncome ? 0 : 3]
    if (newRow) {
      const inputField: Element | null = newRow.querySelectorAll('input[type="number"]')[focusIndex];
      if (inputField instanceof HTMLInputElement) {
        inputField.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    if (event.key === 'Tab' && inputValue) {
      event.preventDefault();
    }
  }

  openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger, row: Category, value: number): void {
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


  applyAll(): void {
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

  deleteCategory(row: Category): void {
    const rowIndex = this.dataSource.find(x => x.category == row.type)?.categories?.indexOf(row);
    if (row.type === 'Income') {
      this.existingIncomeCategories.delete(row.name.toLowerCase());
    } else if (row.type === 'Expense') {
      this.existingExpenseCategories.delete(row.name.toLowerCase());
    }

    if (rowIndex !== -1) {
      this.dataSource.find(x => x.category == row.type)?.categories?.splice(Number(rowIndex), 1) || [];
      const categories = this.dataSource.find(x => x.category == row.type)?.categories || [];
      this.dataSource.find(x => x.category == row.type)!.categories = [...categories];
    }
    this.updateTotals();
    this.cdr.detectChanges();
  }

}



