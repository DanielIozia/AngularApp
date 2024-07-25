import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post.service';
import { User } from '../../interfaces/User-interface';
import { Post } from '../../interfaces/Post-interface';
import { Comment } from '../../interfaces/Comment-interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private user: UserService, private auth: AuthService, private postService: PostService) {}

  id: number = this.auth.getId();
  email: string = this.auth.getEmail()!;
  name: string = this.auth.getName()!;
  gender: string = this.auth.getGender()!;
  status: string = this.auth.getStatus()!;
  posts: Post[] = [];
  showComments: boolean[] = [];
  loadPosts: boolean = true;
  loadComments: boolean[] = [];

  commentForm!: NgForm;
  creatingPost: boolean = false; // Aggiungi questa variabile
  newPost: { title: string, body: string } = { title: '', body: '' }; // Aggiungi questa variabile
  
  ngOnInit(): void {
    this.user.getUserPosts(this.auth.getId()).subscribe((data: Post[]) => {
      this.loadPosts = false;
      this.posts = data;
      this.showComments = new Array(data.length).fill(false); // Initialize the showComments array
      this.loadComments = new Array(data.length).fill(false); // Initialize the loadComments array
      this.posts.forEach(post => post.comments = []); // Initialize comments as empty arrays
    });
  }

  statusOpposite() {
    this.auth.setStatus();
    this.status = this.auth.getStatus()!;
  }

  toggleComments(index: number) {
    this.showComments[index] = !this.showComments[index];
    if (this.showComments[index] && this.posts[index].comments!.length === 0) {
      this.loadComments[index] = true;
      this.postService.getPostComments(this.posts[index].id!).subscribe((comments: Comment[]) => {
        this.loadComments[index] = false;
        this.posts[index].comments = comments;
      });
    }
  }

  addComment(form: NgForm, id_post: number) {
    let comment: Comment = {
      id: this.auth.getId(),
      userId: this.auth.getId(),
      name: this.auth.getName()!,
      email: this.auth.getEmail()!,
      body: form.value.comment,
      postId: id_post,
    }

    this.postService.addPostComment(id_post, comment).subscribe((data: Comment) => {
      const postIndex = this.posts.findIndex(post => post.id === id_post);
      if (postIndex !== -1) {
        this.posts[postIndex].comments?.push(data);
      }
      form.reset();
    });
  }

  createPost() {
    this.creatingPost = true;
  }

  deletePost(id:number){
    this.postService.deletePost(id).subscribe( data => {
      this.ngOnInit();
      console.log(data)
    })
  }

  submitNewPost(form: NgForm) {
    const newPost: Post = {
      user_id: this.auth.getId(),
      title: form.value.title,
      body: form.value.body,
      comments: []
    };

    this.postService.addUserPost(newPost).subscribe( (data: Post) => {
      this.posts.unshift(data); // Aggiungi il nuovo post in cima all'elenco
      this.creatingPost = false;
      form.reset();
      console.log(data);
    });

    this.ngOnInit()
  }

  cancelNewPost() {
    this.creatingPost = false;
  }
}
