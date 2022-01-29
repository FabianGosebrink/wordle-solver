import { TestBed } from '@angular/core/testing';

import { WordleHelperService } from './wordle-helper.service';

describe('WordleHelperService', () => {
  let service: WordleHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordleHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
