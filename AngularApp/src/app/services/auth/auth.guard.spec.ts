import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { AuthGuard } from './auth.guard';
import { User } from '../../interfaces/User-interface';
import { of, throwError } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let authService: AuthService;
  let router: Router;
  let userService: UserService;
  let httpMock: HttpTestingController;
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, UserService, AuthGuard, Router]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    guard = TestBed.inject(AuthGuard);
  });

  it('should navigate to login if token is null', () => {
    spyOn(authService, 'getToken').and.returnValue(null);
    spyOn(router, 'navigate').and.stub();

    guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  it('should allow navigation if user is authenticated', () => {
    const user: User = { id: 1, email: 'test@example.com', gender: 'male', status: 'active', name: 'John Doe' };
    spyOn(authService, 'getToken').and.returnValue('testToken');
    spyOn(authService, 'getId').and.returnValue(1);
    spyOn(userService, 'getUserById').and.returnValue(of(user));

    guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe(result => {
      expect(result).toBeTrue();
    });
  });

  it('should navigate to login if user is unauthorized', () => {
    spyOn(authService, 'getToken').and.returnValue('testToken');
    spyOn(authService, 'getId').and.returnValue(1);
    spyOn(userService, 'getUserById').and.returnValue(throwError({ status: 401 }));
    spyOn(router, 'navigate').and.stub();
    spyOn(localStorage, 'clear').and.stub();

    guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  it('should return false for other errors', () => {
    spyOn(authService, 'getToken').and.returnValue('testToken');
    spyOn(authService, 'getId').and.returnValue(1);
    spyOn(userService, 'getUserById').and.returnValue(throwError({ status: 500 }));

    guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe(result => {
      expect(result).toBeFalse();
    });
  });
});
