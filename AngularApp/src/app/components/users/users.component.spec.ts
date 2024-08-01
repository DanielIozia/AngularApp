import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UsersComponent } from '../../components/users/users.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { User } from '../../interfaces/User-interface';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService;
  let authService: AuthService;
  let dialog: MatDialog;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent, ConfirmDeleteDialogComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        UserService,
        AuthService,
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(true) }) } // Mock dialog service
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') } // Mock router service
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', gender: 'female', status: 'inactive' }
    ];

    spyOn(userService, 'getUsers').and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error on load users', () => {
    spyOn(userService, 'getUsers').and.returnValue(throwError(() => new Error('Error loading users')));

    component.loadUsers();

    expect(component.isLoading).toBeFalse();
    expect(component.users).toEqual([]);
    expect(component.filteredUsers).toEqual([]);
  });

  it('should navigate to user profile on goToProfile', () => {
    component.goToProfile();

    expect(router.navigate).toHaveBeenCalledWith(['/home/profile']);
  });

  it('should navigate to user detail on goToDetail', () => {
    const userId = 1;
    component.goToDetail(userId);

    expect(router.navigate).toHaveBeenCalledWith([`/home/users/${userId}`]);
  });

  it('should filter users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', gender: 'female', status: 'inactive' }
    ];
    component.users = mockUsers;
    component.filterValue = 'Jane';
    component.applyFilter();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Jane Doe');
  });

  it('should clear filter', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', gender: 'female', status: 'inactive' }
    ];
    component.users = mockUsers;
    component.filterValue = 'Jane';
    component.applyFilter();
    component.clearFilter();

    expect(component.filteredUsers).toEqual(mockUsers);
  });

  it('should create new user', () => {
    component.createUser();
    
    expect(component.creatingUser).toBeTrue();
  });

  it('should cancel new user creation', () => {
    component.cancelNewUser();
    
    expect(component.creatingUser).toBeFalse();
  });

  it('should handle successful user creation', fakeAsync(() => {
    const form = { 
      value: { 
        name: 'New User', 
        email: 'newuser@example.com', 
        gender: 'female' as 'female', 
        status: 'active' as 'active' 
      },
      reset: jasmine.createSpy('reset') 
    };
    const mockUser: User = { 
      id: 3, 
      name: 'New User', 
      email: 'newuser@example.com', 
      gender: 'female', 
      status: 'active' 
    };
  
    spyOn(userService, 'createUser').and.returnValue(of(mockUser));
    const loadUsersSpy = spyOn(component, 'loadUsers').and.callThrough();
  
    component.submitNewUserPost(form as any);
  
    tick();
  
    expect(userService.createUser).toHaveBeenCalledWith(form.value, authService.getToken()!);
    expect(component.creatingNewUser).toBeFalse();
    expect(component.creatingUser).toBeFalse();
    expect(loadUsersSpy).toHaveBeenCalled();
    expect(form.reset).toHaveBeenCalled();
  }));

  it('should handle error during user creation', () => {
    const form = { 
      value: { 
        name: 'Invalid User', 
        email: 'invaliduser', 
        gender: 'female', 
        status: 'active' 
      },
      reset: jasmine.createSpy('reset'),
      controls: {
        email: {
          setErrors: jasmine.createSpy('setErrors'),
          reset: jasmine.createSpy('reset')
        }
      }
    } as any;
  
    spyOn(userService, 'createUser').and.returnValue(throwError(() => new Error('Invalid email')));
    spyOn(component, 'resetFormControl').and.callThrough();
  
    component.submitNewUserPost(form as any);
  
    expect(component.creatingNewUser).toBeFalse();
    expect(component.emailError).toBe('Email is invalid');
    expect(component.resetFormControl).toHaveBeenCalledWith(form, 'email');
    expect(form.controls['email'].setErrors).toHaveBeenCalledWith({ invalidEmail: true });
    expect(form.controls['email'].reset).toHaveBeenCalled();
    expect(form.reset).not.toHaveBeenCalled();
  });

  it('should open confirmation dialog', () => {
    const userId = 1;
    const userName = 'John Doe';
  
    const dialogRef = {
      afterClosed: () => of(true) // Simula conferma dell'eliminazione
    };
  
    spyOn(dialog, 'open').and.returnValue(dialogRef as any);
  
    component.deleteUser(userId, userName);
  
    expect(dialog.open).toHaveBeenCalledWith(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { name: userName, id: userId }
    });
  });

  it('should open the confirm delete dialog and delete the user on confirmation', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);

    const loadUsersSpy = spyOn(component, 'loadUsers');

    component.deleteUser(1, 'Test User');

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { name: 'Test User', id: 1 }
    });

    dialogRefSpyObj.afterClosed().subscribe( (result:any) => {
      expect(result).toBe(true);
      expect(loadUsersSpy).toHaveBeenCalled();
    });
  });
  

  it('should handle error during user deletion', fakeAsync(() => {
    const userId = 1;
    const userName = 'John Doe';
    
    // Simula l'apertura del dialogo e chiusura con risultato negativo
    const dialogRef = {
      afterClosed: () => of(false)
    };
  
    spyOn(dialog, 'open').and.returnValue(dialogRef as any);
    spyOn(userService, 'deleteUser').and.returnValue(throwError(() => new Error('Error deleting user')));
    
    component.deleteUser(userId, userName);
    
    tick(); // Avanza il tempo per completare le operazioni asincrone
    
    expect(component.isLoading).toBeFalse();
  }));
});
