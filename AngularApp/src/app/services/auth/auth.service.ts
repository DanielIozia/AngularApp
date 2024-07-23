import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private url_base:string = ""

  isLoggedIn:boolean;
  _isSubscribed:boolean = false;

  constructor() { 
    this.isLoggedIn = true;
  }

  ngOnInit(): void {}

  isAuthenticated(){
    return this.isLoggedIn;
  }

  //signUp methods
  get isSubscribed():boolean{
    return this._isSubscribed;
  }

  checkAuth(){
    
  }

 


}
