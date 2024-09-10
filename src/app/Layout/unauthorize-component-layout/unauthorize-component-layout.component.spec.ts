import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizeComponentLayoutComponent } from './unauthorize-component-layout.component';

describe('UnauthorizeComponentLayoutComponent', () => {
  let component: UnauthorizeComponentLayoutComponent;
  let fixture: ComponentFixture<UnauthorizeComponentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnauthorizeComponentLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizeComponentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
