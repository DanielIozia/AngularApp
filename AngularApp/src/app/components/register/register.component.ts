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
  private usersApi = 'https://gorest.co.in/public/v2/users';
  private accessToken = '?access-token=';
  tokenError: string | null = null;
  emailError: string | null = null;

  constructor(
    private auth:AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers(this.usersApi).subscribe(
      (data: User[]) => this.users = data,
      error => console.error('Error fetching users:', error)
    );
  }

  onSubmit(form: NgForm): void {

    const { name, email, gender, token } = form.value;
    this.resetErrors();

    const newUser: User = { name, email, gender, status: 'active' };

    this.userService.createUser(newUser, token).subscribe(
      response => {
        console.log('User created:', response);
        this.updateLocalStorage(response);
        this.auth.isLoggedIn = true;
        this.router.navigate(['/home/users']);
        this.loadUsersAfterCreation(token);
      },
      error => this.handleError(error, form)
    );
  }

  private resetErrors(): void {
    this.tokenError = null;
    this.emailError = null;
  }

  private updateLocalStorage(user: User): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  //get users with token 
  private loadUsersAfterCreation(token: string): void {
    this.userService.getUsers(`${this.usersApi}${this.accessToken}${token}`).subscribe(
      (data: User[]) => this.users = data,
      error => console.error('Error fetching users after creation:', error)
    );
  }

  private handleError(error: any, form: NgForm): void {
    if (error.status === 401) {
      this.tokenError = 'Invalid Token';
      this.resetFormControl(form, 'token');
    } else if (error.status === 422) {
      this.emailError = 'Email already exists or Email Invalid';
      this.resetFormControl(form, 'email');
    } else {
      console.error('Error creating user:', error);
    }
  }

  private resetFormControl(form: NgForm, controlName: string): void {
    if (form.controls[controlName]) {
      form.controls[controlName].reset();
    }
  }
}
