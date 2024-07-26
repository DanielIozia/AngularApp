  // user-detail.component.ts/
  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { UserService } from '../../services/user.service';
  import { PostService } from '../../services/post.service';
  import { User } from '../../interfaces/User-interface';
  import { Post } from '../../interfaces/Post-interface';
  import { Comment } from '../../interfaces/Comment-interface';
  import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';


  @Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
  })
  export class UserDetailComponent implements OnInit {
    user: User | null = null;
    posts: Post[] = [];
    isLoading: boolean = true;
    loadPosts:boolean = false;
    viewComment: boolean = false;
    selectedPostId: number | null = null;

    showComments: boolean[] = [];
    loadDelete: boolean[] = []; 
    loadComments: boolean[] = [];
    loadingCreatingComment:boolean = false;
    commentForm!: NgForm; 

    


    constructor(
      private route: ActivatedRoute,
      private userService: UserService,
      private postService: PostService,
      private auth:AuthService,
      private router:Router,
      private dialog: MatDialog
    ) {}

    ngOnInit(): void {
      const userId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadUser(userId);
      this.loadUserPosts(userId);
    }

    private loadUser(userId: number): void {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
        this.isLoading = false;
      });
    }

    loadUserPosts(id:number): void {
      this.userService.getUserPosts(id).subscribe( (data: Post[]) => {
        this.loadPosts = false;
        this.posts = data;
        this.showComments = new Array(data.length).fill(false);
        this.loadComments = new Array(data.length).fill(false);
        this.loadDelete = new Array(data.length).fill(false);
        // Inizializza 'comments' come array vuoto per ogni post
        this.posts.forEach(post => {
          if (!post.comments) {
            post.comments = [];
          }
        });
      });
    }

    private loadPostComments(post: Post): void {
      this.postService.getPostComments(post.id!).subscribe((comments: Comment[]) => {
        post.comments = comments;
      });
    }

   
    
    

    addComment(form: NgForm, id_post: number) {
      this.loadingCreatingComment = true;
      let comment: Comment = {
        id: this.auth.getId(),
        userId: this.auth.getId(),
        name: this.auth.getName()!,
        email: this.auth.getEmail()!,
        body: form.value.comment,
        postId: id_post,
      }
  
      this.postService.addPostComment(id_post, comment).subscribe((data: Comment) => {
        this.loadingCreatingComment = false;
        const postIndex = this.posts.findIndex(post => post.id === id_post);
        if (postIndex !== -1) {
          this.posts[postIndex].comments?.push(data);
        }
        form.reset();
      });
    }

    toggleComments(index: number) {
      this.showComments[index] = !this.showComments[index];
      // Verifica che 'comments' sia definito
      if (this.showComments[index] && (!this.posts[index].comments || this.posts[index].comments!.length! === 0)) {
        this.loadComments[index] = true;
        this.postService.getPostComments(this.posts[index].id!).subscribe((comments: Comment[]) => {
          this.loadComments[index] = false;
          this.posts[index].comments = comments;
        });
      }
    }  
  }
