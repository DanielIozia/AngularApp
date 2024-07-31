import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

class MockAuthService {
  login(token: string, email: string, id: string, gender: string, status: string, name: string) {}
}

class MockUserService {
  getUsers(token: string, page: number = 1, userPerPage: number = 10) {
    return of([]);
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockActivatedRoute {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let userService: UserService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to false and show error message if email is invalid', () => {
    const form = {
      value: {
        token: 'valid_token',
        email: 'invalid_email'
      },
      valid: true,
      controls: {
        email: {
          reset: jasmine.createSpy('reset')
        }
      }
    } as any;

    component.onSubmit(form);

    expect(component.isLoading).toBeFalse();
    expect(component.showErrorMessageEmail).toBeTrue();
    expect(component.errorMessageEmail).toBe('Invalid email');
    expect(form.controls.email.reset).toHaveBeenCalled();
  });

  it('should show error message if form is invalid', () => {
    const form = {
      value: {
        token: 'valid_token',
        email: 'valid_email@example.com'
      },
      valid: false,
      controls: {}
    } as any;

    component.onSubmit(form);

    expect(component.showErrorMessage).toBeTrue();
    expect(component.errorMessage).toBe('Invalid Form');
  });

  it('should navigate to home/users if user is found', async () => {
    const form = {
      value: {
        token: 'valid_token',
        email: 'valid_email@example.com'
      },
      valid: true,
      controls: {}
    } as any;
  
    // Spy per simulare il comportamento di userService.getUsers
    spyOn(userService, 'getUsers').and.callFake((token: string) => {
      // Restituisce un Observable con un array di utenti
      return of([{ email: 'valid_email@example.com', id: 1 } as User]);
    });
  
    // Spy per monitorare le chiamate a router.navigate
    spyOn(router, 'navigate');
  
    // Esegui la funzione onSubmit
    await component.onSubmit(form);
  
    // Verifica che router.navigate sia stato chiamato con il percorso corretto
    expect(router.navigate).toHaveBeenCalledWith(['/home/users']);
  });
  
  

  it('should show error message if user is not found', async () => {
    const form = {
      value: {
        token: 'valid_token',
        email: 'invalid_email@example.com'
      },
      valid: true,
      controls: {
        email: {
          reset: jasmine.createSpy('reset')
        }
      }
    } as any;

    spyOn(userService, 'getUsers').and.returnValue(of([]));

    await component.onSubmit(form);

    expect(component.isLoading).toBeFalse();
    expect(component.showErrorMessageEmail).toBeTrue();
    expect(component.errorMessageEmail).toBe('Invalid email');
    expect(form.controls.email.reset).toHaveBeenCalled();
  });

  it('should show error message if getUsers throws an error', async () => {
    const form = {
      value: {
        token: 'valid_token',
        email: 'valid_email@example.com'
      },
      valid: true,
      controls: {
        token: {
          reset: jasmine.createSpy('reset')
        }
      }
    } as any;

    spyOn(userService, 'getUsers').and.returnValue(throwError('error'));

    await component.onSubmit(form);

    expect(component.isLoading).toBeFalse();
    expect(component.showErrorMessage).toBeTrue();
    expect(component.errorMessage).toBe('Invalid Token');
    expect(form.controls.token.reset).toHaveBeenCalled();
  });
  
});
