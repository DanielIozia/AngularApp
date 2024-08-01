import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { User } from '../../interfaces/User-interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    
    if (this.authService.getToken() == null) {
      this.router.navigate(['/login']);
      return of(false);
    } 

    else {
      //se è stato fatto l'accesso, ho un id nel localStorage e quindi eseguo l'accesso (ritorna true)
      return this.userService.getUserById(this.authService.getId()).pipe(
        map((user: User) => true),
        catchError((error) => {
          if (error.status == 401) {
            console.log("Token non valido");
            this.router.navigate(['/login']);
            localStorage.clear();
          }
          return of(false);
        })
      );
    }
  }
}
