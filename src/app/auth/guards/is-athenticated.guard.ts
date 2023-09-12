import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isAthenticatedGuard: CanActivateFn = async(route, state) => {
  const router = inject(Router);
  //const url = state.url;
  //localStorage.setItem('url',url);
  const authServices = inject(AuthService)
  const promise=await authServices.checkAuthStatus().toPromise()


  if (authServices.authStatus() === AuthStatus.authenticathed) {
    return true
  };
  router.navigateByUrl('/auth/login')



  return true;
};
