import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/Post-interface';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User-interface';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  
  posts: Post[] = [];
  isLoading: boolean = true; // Variabile per gestire lo stato di caricamento
  user_name:string = "";

  constructor(private post: PostService, private user:UserService) { }

  ngOnInit(): void {
    this.post.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
      this.isLoading = false; // Disattiva il caricamento una volta ottenuti i dati
    });
  }

  expandedId: number | null = null;

  expandText(id: number) {
    this.expandedId = id;
  }

  collapseText() {
    this.expandedId = null;
  }

  
   
}
