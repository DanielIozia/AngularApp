import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/User-interface';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private numberSource = new BehaviorSubject<number>(0);
  currentNumber = this.numberSource.asObservable();


  constructor(private http:HttpClient){}

  getUsers(url:string): Observable<User[]> {
    return this.http.get<User[]>(url);
  }

  changeNumber(number: number) {
    this.numberSource.next(number);
  }

  addUser(url:string, user: User): Observable<User> {
    return this.http.post<User>(url, user);
  }



}
