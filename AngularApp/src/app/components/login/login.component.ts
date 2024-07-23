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
export class LoginComponent implements OnInit {

  showErrorMessage: boolean; 
  errorMessage:string|null = null;
  users:User[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.showErrorMessage = false;
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const token = form.value.token;

    if (form.valid) {
      this.userService.getUsers(token)
        .subscribe(
          (data: User[]) => {
            this.users = data;
            console.log("Users: ", this.users);

            // Se l'autenticazione ha successo
            this.authService.login(token);
            this.router.navigate(['/home/users']);
          },
          error => {
            console.error('Errore durante il login:', error);
            this.showErrorMessage = true;
            this.errorMessage = "Invalid Token";
            form.reset();
          }
        );
    } else {
      this.showErrorMessage = true;
      this.errorMessage = "Invalid Form";
    }
  }
}
