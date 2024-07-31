import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { AuthService } from '../../services/auth/auth.service';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';



class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)  // Simula l'output della chiusura del dialog
    };
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: AuthService },
        { provide: Router },
        { provide: MatDialog, useClass: MatDialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // Ignora errori di template non definiti nel test
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateToLogin', () => {
    it('should open the LogoutDialogComponent dialog', () => {
      const dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
      component.navigateToLogin();
      expect(dialogOpenSpy).toHaveBeenCalled();
      expect(dialogOpenSpy).toHaveBeenCalledWith(LogoutDialogComponent, { width: '250px' });
    });
  });
});
