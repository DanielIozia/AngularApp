import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const authService = inject(AuthService);
  const router = inject(Router)

  if (authService.isLoggedIn) {
    return true;
  } 
  else {
    router.navigate(['/login']);
    return false;
  }

  

  
};
