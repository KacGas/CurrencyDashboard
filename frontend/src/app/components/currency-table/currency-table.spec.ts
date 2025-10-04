import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTable } from './currency-table';

describe('CurrencyTable', () => {
  let component: CurrencyTable;
  let fixture: ComponentFixture<CurrencyTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
