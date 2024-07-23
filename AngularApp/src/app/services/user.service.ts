import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


//interfaces
import { User } from '../interfaces/User-interface';
import { Post } from '../interfaces/Post-interface';
import { AuthService } from './auth/auth.service';


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

    return this.http.post<User>(`${this.BASE_URL}${this.USER_SEGMENT}${this.access_token+token}`, user, {headers});
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