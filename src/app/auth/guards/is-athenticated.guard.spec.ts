import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isAthenticatedGuard } from './is-athenticated.guard';

describe('isAthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isAthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
