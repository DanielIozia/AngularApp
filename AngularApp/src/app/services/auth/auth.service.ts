import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
  }

  login(token: string) {
    localStorage.setItem('authToken', token);
    this.isLoggedIn = true;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}
