import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    showErrorMessage: boolean; 
    errorMessage:string|null = null;

  constructor(private login: LoginService, private auth: AuthService, private router: Router) {
    this.showErrorMessage = false; //serve per mostrare "Nome utenti o password errati"
  }

  ngOnInit(): void {
    
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const user = { email: email, password: password, returnSecureToken: true };

    if (form.valid) {
      this.auth.isLoggedIn = true;
      this.router.navigate(['/home/users']);
      form.reset();
    }    
  }
}
