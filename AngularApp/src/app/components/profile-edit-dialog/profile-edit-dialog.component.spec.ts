import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ProfileEditDialogComponent } from './profile-edit-dialog.component';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';

// Mock dei servizi
class MockUserService {
  updateUser(user: User) {
    return of(user); // Simula una risposta di successo
  }
}

describe('ProfileEditDialogComponent', () => {
  let component: ProfileEditDialogComponent;
  let fixture: ComponentFixture<ProfileEditDialogComponent>;
  let userService: UserService;
  let dialogRef: MatDialogRef<ProfileEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [ProfileEditDialogComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'John Doe', email: 'john.doe@example.com', gender: 'male', status: 'active' } },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora errori di template non rilevanti per i test
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEditDialogComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'test@.com';
    
    expect(component.isValidEmail(validEmail)).toBeTrue();
    expect(component.isValidEmail(invalidEmail)).toBeFalse();
  });

  it('should call onCancel and close the dialog', () => {
    spyOn(component.dialogRef, 'close');
    component.onCancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should update user successfully', () => {
    spyOn(userService, 'updateUser').and.callThrough();
    spyOn(component.dialogRef, 'close');

    const form = { value: { name: 'Jane Doe', email: 'jane.doe@example.com', gender: 'female', status: 'inactive' }, valid: true } as any;
    component.onUpdate(form);
    
    expect(userService.updateUser).toHaveBeenCalledWith(form.value);
    expect(component.dialogRef.close).toHaveBeenCalledWith(form.value);
  });

  it('should show error for invalid email', () => {
    spyOn(userService, 'updateUser').and.callThrough();

    const form = { value: { name: 'Jane Doe', email: 'invalid-email', gender: 'female', status: 'inactive' }, valid: true } as any;
    component.onUpdate(form);

    expect(component.showErrorMessage).toBeTrue();
    expect(component.errorMessage).toEqual('Invalid Email');
  });

  it('should handle updateUser error', () => {
    spyOn(userService, 'updateUser').and.returnValue(throwError(() => new Error('Error')));
    spyOn(component.dialogRef, 'close');
  
    // Definizione del form simulato con il controllo 'email'
    const form = {
      value: { name: 'Jane Doe', email: 'jane.doe@example.com', gender: 'female', status: 'inactive' },
      valid: true,
      controls: { email: { reset: () => {} } }  // Controllo simulato
    } as any;
  
    spyOn(form.controls.email, 'reset');
  
    component.onUpdate(form);
  
    // Aggiungi log per il debug
    console.log('Error Message:', component.errorMessage);
    console.log('Show Error Message:', component.showErrorMessage);
  
    expect(component.showErrorMessage).toBeTrue();
    expect(component.errorMessage).toEqual('Email già in uso o non valida');
    expect(form.controls.email.reset).toHaveBeenCalled();
  });
  

  it('should reset email form control', () => {
    const form = { controls: { email: { reset: () => {} } } } as any;
    spyOn(form.controls.email, 'reset');

    component.resetFormControl(form, 'email');
    expect(form.controls.email.reset).toHaveBeenCalled();
  });
});
