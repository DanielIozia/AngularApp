import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/Post-interface';
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

}
