import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/Post-interface';
import { Comment } from '../interfaces/Comment-interface';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient){}


  getPosts(url:string):Observable<Post[]>{
    return this.http.get<Post[]>(url);
  }

  addPost(url:string,post:Post):Observable<Post>{
    return this.http.post<Post>(url,post);
  }

  getPostComments(url:string, postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${url}/${postId}/comments`);
  }

  addComment(url:string,postId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${url}/${postId}/comments`, comment);
  }

 

}
