import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const signUpGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router)

  authService.checkAuth();
  
  if (authService.isSubscribed) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/register');
};
