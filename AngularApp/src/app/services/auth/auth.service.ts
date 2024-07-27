import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  

  constructor() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = false;
  }

  login(token: string, email:string, id:string,gender:string,status:string,name:string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('email', email)
    localStorage.setItem('id', id)
    localStorage.setItem('gender', gender)
    localStorage.setItem('status', status)
    localStorage.setItem('name', name)
    this.isLoggedIn = true;
    console.log("LOGGATO");
  }

  logout() {
    console.log("QUIT");
    localStorage.clear();
    this.isLoggedIn = false;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getEmail(){
    return localStorage.getItem('email');
  }

  getId(){
    return parseInt(localStorage.getItem('id')!,10)
  }

  getName(){
    return localStorage.getItem('name');
  }

  getGender(){
    return localStorage.getItem('gender');
  }

  getStatus(){
    return localStorage.getItem('status');
  }

  setStatus(){
    if(this.getStatus() == "active"){
      localStorage.setItem('status', "inactive");
    }
    else{
      localStorage.setItem('status', "active");
    }
    return this.getStatus();
  }
  
}
