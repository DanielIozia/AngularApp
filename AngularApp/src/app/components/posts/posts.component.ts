import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/Post-interface';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  postAPI: string = "https://gorest.co.in/public/v2/posts";
  posts: Post[] = [];
  isLoading: boolean = true; // Variabile per gestire lo stato di caricamento

  constructor(private post: PostService) { }

  ngOnInit(): void {
    this.post.getPosts(this.postAPI).subscribe((data: Post[]) => {
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
