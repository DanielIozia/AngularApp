import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


//interfaces
import { User } from '../interfaces/User-interface';
import { Post } from '../interfaces/Post-interface';


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

  getUserById(url:string,id: number): Observable<User> {
    return this.http.get<User>(`${url}/${id}`);
  }

  getUserPosts(url:string, userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${url}/${userId}/posts`);
  }

  changeNumber(number: number) {
    this.numberSource.next(number);
  }

  addUser(url:string, user: User): Observable<User> {
    return this.http.post<User>(url, user);
  }
  
  



}
