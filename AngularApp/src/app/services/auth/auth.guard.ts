import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../interfaces/User-interface';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const authService = inject(AuthService);
  const router = inject(Router)
  const userService = inject(UserService)

  if(authService.getToken() == null){
    router.navigate(['/login']);
    return false;
  }
  else{
    userService.getUserById(authService.getId()).subscribe( (user:User) => {
      return true;
    }, (error) => {
      if(error.status == 401){
        console.log("Token non valido");
        router.navigate(['/login']);
        localStorage.clear();
        return false;
      }
      else{
        return false;
      }
    })
  }
  return true;
};
