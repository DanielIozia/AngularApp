import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  isLoggedIn:boolean;

  constructor() { 
    this.isLoggedIn = true;
  }

  ngOnInit(): void {}

  isAuthenticated(){
    return this.isLoggedIn;
  }


}
