import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/User-interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  users: User[] = [];
  tokenError: string | null = null;
  emailError: string | null = null;
  isLoading: boolean = false; 

  constructor(
    private auth:AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    this.isLoading = true;
    const { name, email, gender, status, token } = form.value;

    this.resetErrors();
    
    const newUser: User = { name, email, gender, status };

    this.userService.createUser(newUser,token).subscribe(
      (response:User) => {
        this.isLoading = false;
        this.auth.login(token,email,response.id!.toString(),response.gender!,response.status,response.name);
        this.router.navigate(['/home/users']);
      },
      error => this.handleError(error, form)
    );
  }

  private resetErrors(): void {
    this.tokenError = null;
    this.emailError = null;
  }

  handleError(error: any, form: NgForm): void {
    this.isLoading = false;
    if (error.status === 401) {
      // Gestione dell'errore di token non valido
      this.tokenError = 'Invalid Token';
      this.resetFormControl(form, 'token');
    } else if (error.status === 422) {
      // Supponiamo che il corpo dell'errore sia un array di oggetti con i campi "field" e "message"
      const errorMessages = error.error as { field: string; message: string }[];
      
      if (Array.isArray(errorMessages)) {
        // Itera attraverso il array di messaggi di errore
        errorMessages.forEach(err => {
          if (err.field === 'email') {
            this.emailError = "Email " + err.message; // Imposta il messaggio di errore per l'email
            this.resetFormControl(form, 'email');
          }
          // Puoi aggiungere altre logiche per gestire altri campi se necessario
        });
      } else {
        console.error('Unexpected error format:', error);
      }
    } else {
      // Gestione di altri tipi di errori
      console.error('Error creating user:', error);
    }
  }
  

  private resetFormControl(form: NgForm, controlName: string): void {
    if (form.controls && form.controls[controlName]) {
      form.controls[controlName].reset();
    }
  }
}
