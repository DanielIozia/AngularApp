import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

//interfaces
import { User } from '../interfaces/User-interface';
import { Post } from '../interfaces/Post-interface';
import { AuthService } from './auth/auth.service';

import { MatFormFieldControl } from '@angular/material/form-field';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  public BASE_URL:string = 'https://gorest.co.in/public/v2';
  public COMMENT_SEGMENT = '/comments';
  public POSTS_SEGMENT ='/posts';
  public USER_SEGMENT ='/users';
  public access_token = '?access-token=';
  public PAGE:string = '?page=';
  public PER_PAGE:string = '&per_page=';

  private numberSource = new BehaviorSubject<number>(0);
  currentNumber = this.numberSource.asObservable();


  constructor(private http:HttpClient, private auth:AuthService){}

 
  
  getUsers(token:string|null,page:number = 1, userPerPage:number = 10): Observable<User[]> {

    const headers = new HttpHeaders({
      'Authentication': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<User[]>(`${this.BASE_URL}${this.USER_SEGMENT}${this.access_token+token}&page=${page}&per_page=${userPerPage}`);
  }

  createUser(user: User, token: string): Observable<User> {

    const headers = new HttpHeaders({
      'Authentication': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<User>(`${this.BASE_URL}${this.USER_SEGMENT}${this.access_token}${token}`, user, {headers} );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}${this.USER_SEGMENT}/${id}${this.access_token}${this.auth.getToken()}`);
  }

  
  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.BASE_URL}${this.USER_SEGMENT}/${userId}${this.POSTS_SEGMENT}${this.access_token}${this.auth.getToken()}`);
  }

  deleteUser(user:number):Observable<User>{
    return this.http.delete<User>(`${this.BASE_URL}${this.USER_SEGMENT}/${user}${this.access_token}${this.auth.getToken()}`);
  }

  // /public/v2/users/6940396
  updateUser(user:User):Observable<User>{
    
    const headers = new HttpHeaders({
      'Authentication': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.put<User>(`${this.BASE_URL}${this.USER_SEGMENT}/${this.auth.getId()}${this.access_token}${this.auth.getToken()}`,user,{headers});
  }

 
 
}