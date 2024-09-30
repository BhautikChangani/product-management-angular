import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetcalculatorComponent } from './budgetcalculator.component';

describe('BudgetcalculatorComponent', () => {
  let component: BudgetcalculatorComponent;
  let fixture: ComponentFixture<BudgetcalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetcalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetcalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
