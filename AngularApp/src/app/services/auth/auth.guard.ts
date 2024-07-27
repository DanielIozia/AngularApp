import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const authService = inject(AuthService);
  const router = inject(Router)

  if (authService.isLoggedIn) {
    console.log("STO LOGGANDO")
    return true;
  } 
  else {
    console.log("è falso")
    router.navigate(['/login']);
    return false;
  }


  
};
