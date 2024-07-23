// user-detail.component.ts/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { User } from '../../interfaces/User-interface';
import { Post } from '../../interfaces/Post-interface';
import { Comment } from '../../interfaces/Comment-interface';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  posts: Post[] = [];
  isLoading: boolean = true;
  viewComment: boolean = false;
  selectedPostId: number | null = null;

  private userAPI = 'https://gorest.co.in/public/v2/users';
  private postAPI: string = "https://gorest.co.in/public/v2/posts";
  private commentApi: string = "https://gorest.co.in/public/v2/comments";

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.loadUser(userId);
      this.loadUserPosts(userId);
    }
  }

  private loadUser(userId: number): void {
    this.userService.getUserById("",userId).subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }

  private loadUserPosts(userId: number): void {
    this.userService.getUserPosts("",userId).subscribe(posts => {

      this.posts = posts;
      this.posts.forEach(post => {
        this.loadPostComments(post);
      });
    });
  }

  private loadPostComments(post: Post): void {
    this.postService.getPostComments(this.postAPI, post.id).subscribe((comments: Comment[]) => {
      console.log("post.id: ", post.id);
      post.comments = comments;
      this.loadCommentAuthors(post);
    });
  }

  private loadCommentAuthors(post: Post): void {
    
    /*if (post.comments) { 
      console.log("post.commmets: ",post.comments);
      // Verifica se post.comments è definito
      post.comments.forEach( (comment:Comment) => {
        if (comment.userId) { // Verifica se comment.userId è definito
          this.userService.getUserById(this.userAPI, comment.userId).subscribe(
            (user:User) => {
              comment.name = user.name; // Assumendo che l'oggetto Comment ha il campo 'name' per il nome dell'utente
            }
          )
        } 
        else {
          console.error('Comment userId is undefined:', comment);
        }
      });
    } else {
      console.error('Post comments are undefined:', post);
    }*/
  }
  
  toggleComments(postId: number): void {
    if (this.selectedPostId === postId) {
      this.selectedPostId = null;
    } else {
      this.selectedPostId = postId;
    }
  }

  

  

  addComment(postId: number, content: string): void {
    
    if (!postId) {
      console.error('Post ID is undefined or invalid');
      return;
    }
  
    const newComment: Comment = {
      postId,
      id: Date.now(), // Genera un ID temporaneo per il commento
      userId: 1, // Modifica questo ID per rappresentare l'utente attualmente loggato
      body: content,
      name: 'Your Name', // Modifica questo valore per rappresentare il nome dell'utente loggato
      email: 'your.email@example.com'
    };
  
    this.postService.addComment(this.postAPI, postId, newComment).subscribe((comment: Comment) => {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        if (!post.comments) {
          post.comments = []; // Inizializza comments come un array vuoto se non è definito
        }
        post.comments.push(comment);
        this.loadCommentAuthors(post);
      }
    });
  }
  
  
}
