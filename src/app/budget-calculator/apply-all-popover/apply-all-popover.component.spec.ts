import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyAllPopoverComponent } from './apply-all-popover.component';

describe('ApplyAllPopoverComponent', () => {
  let component: ApplyAllPopoverComponent;
  let fixture: ComponentFixture<ApplyAllPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplyAllPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyAllPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
