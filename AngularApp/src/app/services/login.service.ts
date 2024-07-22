import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private endPoint = " https://gorest.co.in/public/v2/users?access-token=";

  constructor(private http:HttpClient) { }

  

}
