import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/Post-interface';
import { Comment } from '../interfaces/Comment-interface';
import { AuthService } from './auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  public BASE_URL:string = 'https://gorest.co.in/public/v2';
  public COMMENT_SEGMENT = '/comments';
  public POSTS_SEGMENT ='/posts';
  public USER_SEGMENT ='/users';
  public access_token = '?access-token=';
  public PAGE:string = '?page=';
  public PER_PAGE:string = '&per_page=';

  constructor(private http:HttpClient, private auth:AuthService){}

  getPosts(page:number = 1, postsPerPage:number = 10):Observable<Post[]>{
    return this.http.get<Post[]>(`${this.BASE_URL}${this.POSTS_SEGMENT}${this.access_token}${this.auth.getToken()}&page=${page}&per_page=${postsPerPage}`);
  }

   // /public/v2/posts/6940392/comments
   getPostComments(id_post:number):Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.BASE_URL}${this.POSTS_SEGMENT}/${id_post}${this.COMMENT_SEGMENT}${this.access_token}${this.auth.getToken()}`);
  }


  ///public/v2/posts/6940392/comments
  addPostComment(id_post:number, comment:Comment):Observable<Comment>{

    const headers = new HttpHeaders({
      'Authentication': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<Comment>(`${this.BASE_URL}${this.POSTS_SEGMENT}/${id_post}${this.COMMENT_SEGMENT}${this.access_token}${this.auth.getToken()}`,comment, {headers})
  }
  ///public/v2/users/6940392/posts
  
  addUserPost(post:Post):Observable<Post>{

    const headers = new HttpHeaders({
      'Authentication': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<Post>(`${this.BASE_URL}${this.USER_SEGMENT}/${this.auth.getId()}${this.POSTS_SEGMENT}${this.access_token}${this.auth.getToken()}`,post, {headers})
  }

  deletePost(id_post:number){
    const headers = new HttpHeaders({
      'Authentication': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.delete(`${this.BASE_URL}${this.POSTS_SEGMENT}/${id_post}${this.access_token}${this.auth.getToken()}`,{headers})
  }

  



  


 

 

}
