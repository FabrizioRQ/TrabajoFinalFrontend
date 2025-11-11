import { TestBed } from '@angular/core/testing';

import { TerapiaService } from './terapia.service';

describe('TerapiaService', () => {
  let service: TerapiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerapiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
