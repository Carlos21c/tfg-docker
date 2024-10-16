import { TestBed } from '@angular/core/testing';

import { FormstateService } from './formstate.service';

describe('FormstateService', () => {
  let service: FormstateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormstateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
