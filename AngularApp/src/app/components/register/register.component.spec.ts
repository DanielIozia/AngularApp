import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/User-interface';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

// Mock dei servizi e router
class MockUserService {
  createUser(user: User, token: string) {
    return of(user);
  }
}

class MockAuthService {
  login() {}
  getToken() {
    return 'mock-token';
  }
  getId() {
    return 1;
  }
}

class MockActivatedRoute {
  // Mock dei parametri dell'ActivatedRoute, se necessari
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormField,
        MatLabel, 
        MatOption, 
        RouterLink,  
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
        ],
      declarations: [RegisterComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.createUser and navigate on successful form submission', () => {
    const form = { value: { name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active', token: 'mock-token' } } as NgForm;
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' };

    spyOn(userService, 'createUser').and.returnValue(of(mockUser));
    spyOn(authService, 'login').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();

    component.onSubmit(form);

    expect(userService.createUser).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith('mock-token', 'john@example.com', '1', 'male', 'active', 'John Doe');
    expect(router.navigate).toHaveBeenCalledWith(['/home/users']);
  });

  it('should handle error for invalid token', () => {
    const form = { value: { name: '', email: '', gender: '', status: '', token: '' } } as NgForm;
    const errorResponse = { status: 401 };
    spyOn(userService, 'createUser').and.returnValue(throwError(errorResponse));
    spyOn(component, 'handleError').and.callThrough();

    component.onSubmit(form);

    expect(component.tokenError).toBe('Invalid Token');
  });

  it('should handle validation error for email', () => {
    const form = { value: { name: '', email: '', gender: '', status: '', token: '' } } as NgForm;
    const errorResponse = {
      status: 422,
      error: [{ field: 'email', message: 'is required' }]
    };
    spyOn(userService, 'createUser').and.returnValue(throwError(errorResponse));
    spyOn(component, 'handleError').and.callThrough();

    component.onSubmit(form);

    expect(component.emailError).toBe('Email is required');
  });
});
