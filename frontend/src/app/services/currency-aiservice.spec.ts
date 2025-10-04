import { TestBed } from '@angular/core/testing';

import { CurrencyAIService } from './currency-aiservice';

describe('CurrencyAIService', () => {
  let service: CurrencyAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
