import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDetailsDialogComponent } from './portfolio-details-dialog.component';

describe('PortfolioDetailsDialogComponent', () => {
  let component: PortfolioDetailsDialogComponent;
  let fixture: ComponentFixture<PortfolioDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
