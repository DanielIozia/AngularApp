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

  constructor(private login: LoginService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

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
