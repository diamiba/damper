import { TestBed } from '@angular/core/testing';

import { ComputingService } from './computing.service';

describe('ComputingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComputingService = TestBed.get(ComputingService);
    expect(service).toBeTruthy();
  });
});
