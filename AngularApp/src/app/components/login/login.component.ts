import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  showErrorMessage: boolean; 
  showErrorMessageEmail: boolean; 
  errorMessage: string | null = null;
  errorMessageEmail: string | null = null;
  users: User[] = [];
  isLoading: boolean = false; // Aggiungi questa variabile
  email: string | null = null;


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.showErrorMessage = false;
    this.showErrorMessageEmail = false;
  }

  validateEmail(emailInput: any): void {
    this.showErrorMessageEmail = false;

    // Simple email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailPattern.test(emailInput.value)) {
      this.errorMessageEmail = 'L\'email non è valida';
      this.showErrorMessageEmail = true;
    } else {
      this.errorMessageEmail = '';
    }

    // Trigger Angular validation
    emailInput.control.markAsTouched();
    emailInput.control.updateValueAndValidity();
  }

  
  
  onSubmit(form: NgForm): void {
    const token = form.value.token;
    const email = form.value.email;
  
    if (form.valid) {
      this.isLoading = true; // Imposta lo stato di caricamento a true
      this.userService.getUsers(token).subscribe(
        (data: User[]) => {
          this.users = data;
  
          // Verifica se l'email esiste tra gli utenti
          this.checkUser(token, email).then((exists) => {
            this.isLoading = false; // Imposta lo stato di caricamento a false
            if (!exists) {
              this.showErrorMessageEmail = true;
              this.errorMessageEmail = "Invalid email";
              this.resetFormControl(form, 'email');
            } else {
              //this.authService.login(token, email);
              this.router.navigate(['/home/users']);
            }
          }).catch(error => {
            this.isLoading = false; // Imposta lo stato di caricamento a false
            console.error('Errore durante il login:', error);
            this.showErrorMessage = true;
            this.errorMessage = "Error checking user";
          });
        },
        error => {
          this.isLoading = false; // Imposta lo stato di caricamento a false
          console.error('Errore durante il login:', error);
          this.showErrorMessage = true;
          this.errorMessage = "Invalid Token";
          this.resetFormControl(form, 'token');
        }
      );
    } else {
      this.showErrorMessage = true;
      this.errorMessage = "Invalid Form";
    }
  }
  

  checkUser(token: string, email: string, index: number = 1, limit: number = 100): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getUsers(token, index, limit).subscribe(
        (data: User[]) => {
          for (let u of data) {
            if (u.email === email) {
              // Email trovata, eseguo il login
              u.status = "active";
              this.authService.login(token,email,(u.id)!.toString(),u.gender,u.status,u.name);   
              resolve(true);
              return;
            }
          }
          if (data.length === 0) {
            // Nessun utente trovato nella richiesta corrente, interrompi la ricerca
            resolve(false);
            return;
          }
          // Continua a cercare nella pagina successiva
          this.checkUser(token, email, index + 1, limit).then(resolve).catch(reject);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  private resetFormControl(form: NgForm, controlName: string): void {
    if (form.controls[controlName]) {
      form.controls[controlName].reset();
    }
  }


}


