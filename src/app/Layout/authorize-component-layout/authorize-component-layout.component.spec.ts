import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeComponentLayoutComponent } from './authorize-component-layout.component';

describe('AuthorizeComponentLayoutComponent', () => {
  let component: AuthorizeComponentLayoutComponent;
  let fixture: ComponentFixture<AuthorizeComponentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorizeComponentLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeComponentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
