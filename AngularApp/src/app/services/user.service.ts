import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/User-interface';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  constructor(private http:HttpClient){}

  getUsers(url:string): Observable<User[]> {
    return this.http.get<User[]>(url);
  }

  addUser(url:string, body:User):Observable<User[]>{
    return this.http.post<User[]>(url,body);
  }



}
