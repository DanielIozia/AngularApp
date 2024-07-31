import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../interfaces/User-interface';

describe('ConfirmDeleteDialogComponent', () => {
  let component: ConfirmDeleteDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteDialogComponent>;
  let mockDialogRef: MatDialogRef<ConfirmDeleteDialogComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj(['close']);
    mockUserService = jasmine.createSpyObj('UserService', ['deleteUser']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getId', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogContent, BrowserAnimationsModule, MatDialogActions],
      declarations: [ConfirmDeleteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test User', id: 1 } },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on onNoClick', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should delete user and close dialog on onYesClick', fakeAsync(() => {
    const mockUser: User = {
      name: 'Test User',
      email: 'test@example.com',
      gender: 'male',
      status: 'active'
    };

    mockUserService.deleteUser.and.returnValue(of(mockUser));
    mockAuthService.getId.and.returnValue(1);

    component.onYesClick();
    tick(); // Simula il passare del tempo per completare l'operazione asincrona

    expect(component.loading).toBeFalse();
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('should handle error on delete failure', fakeAsync(() => {
    mockUserService.deleteUser.and.returnValue(throwError('Error'));

    component.onYesClick();
    tick(); // Simula il passare del tempo per completare l'operazione asincrona

    expect(component.loading).toBeFalse();
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    expect(component.error).toBe('Failed to delete user. Please try again.');
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  }));
});
