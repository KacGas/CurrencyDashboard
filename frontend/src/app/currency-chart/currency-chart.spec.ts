import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyChart } from './currency-chart';

describe('CurrencyChart', () => {
  let component: CurrencyChart;
  let fixture: ComponentFixture<CurrencyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
