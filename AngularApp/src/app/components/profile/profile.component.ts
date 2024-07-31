import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post.service';
import { User } from '../../interfaces/User-interface';
import { Post } from '../../interfaces/Post-interface';
import { Comment } from '../../interfaces/Comment-interface';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditDialogComponent } from '../../components/profile-edit-dialog/profile-edit-dialog.component';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-post-delete-dialog/confirm-post-delete-dialog.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  id: number = this.auth.getId();
  email: string = this.auth.getEmail()!;
  name: string = this.auth.getName()!;
  gender: string = this.auth.getGender()!;
  status: string = this.auth.getStatus()!;
  posts: Post[] = [];
  showComments: boolean[] = [];
  loadPosts: boolean = true;
  loadComments: boolean[] = [];
  loadDelete: boolean[] = [];
  loadingDelete: boolean = false;
  commentForm!: NgForm; 
  creatingPost: boolean = false;
  creatingNewPost:boolean = false;
  newPost: { title: string, body: string } = { title: '', body: '' };
  loadingCreatingComment:boolean = false;
  textError:string = '';
  showtextError:boolean = false;

  


  

  constructor(private user: UserService, private auth: AuthService, private postService: PostService,private dialog: MatDialog, private router:Router) {}

  ngOnInit(): void {
    this.loadUserPosts();
  }

  loadUserPosts(): void {
    this.user.getUserPosts(this.auth.getId()).subscribe( (data: Post[]) => {
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

  update() {
    const dialogRef = this.dialog.open(ProfileEditDialogComponent, {
      width: '80%',  // Imposta la larghezza a una percentuale più grande
      maxWidth: '600px', // Imposta una larghezza massima per evitare che il dialogo diventi troppo largo
      data: { 
        name: this.name, 
        email: this.email, 
        gender: this.gender, 
        status: this.status 
      }
    });

    

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.name = result.name;
        this.email = result.email;
        this.gender = result.gender;
        this.status = result.status;

        // Aggiorno il local storage 
        this.auth.login(this.auth.getToken()!, this.email, this.auth.getId().toString(), this.gender, this.status, this.name);
      }
    });
}

 

toggleComments(index: number) {
  if (!this.posts || !this.posts[index]) {
    return;
  }
  
  const post = this.posts[index];
  this.showComments[index] = !this.showComments[index];
  if (this.showComments[index] && !this.loadComments[index]) {
    this.loadComments[index] = true;
    
    if (post.id) {
      this.postService.getPostComments(post.id).subscribe(
        comments => {
          post.comments = comments;
          this.loadComments[index] = false;
        },
        error => {
          console.error('Error loading comments', error);
          this.loadComments[index] = false;
        }
      );
    }
  }
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
    };
  
    this.postService.addPostComment(id_post, comment).subscribe(
      (data: Comment) => {
        this.loadingCreatingComment = false;
        const postIndex = this.posts.findIndex(post => post.id === id_post);
        if (postIndex !== -1) {
          this.posts[postIndex].comments?.push(data);
        }
        form.reset();
      },
      error => {
        this.loadingCreatingComment = false;
        this.textError = 'post update error';
      }
    );
  }
  

  createPost() {
    this.creatingPost = true;
  }

 

  submitNewPost(form: NgForm) {
    this.creatingNewPost = true;

    const newPost: Post = {
      user_id: this.auth.getId(),
      title: form.value.title,
      body: form.value.body,
    };

    this.postService.addUserPost(newPost).subscribe( (data: Post) => {
      this.showtextError = false;
      this.creatingNewPost = false;
      this.posts.unshift(data);// Carica i post nuovamente dopo la creazione di un nuovo post
      this.creatingPost = false;
      form.reset();
      this.loadUserPosts();   
    },error => {
      this.creatingNewPost = false;
      this.showtextError = true;
      form.reset();
      this.textError = "post update error";
    });
  }

  

  //DELETE USER
    delete(): void {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '300px',
        data: { name: this.name, id:this.auth.getId() } // Passa i dati necessari al dialogo
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log("Profilo eliminato con successo");
        }
        else{
          console.log("Profilo personale non eliminato");
        }
      }, error => {
        console.log("Errore nell'eliminazione del profilo personale");
      });
    }

    

    deletePost(post: Post, index: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent,{
        width: '250px',
        data: { title: post.title }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.postService.deletePost(post.id!).subscribe(() => {
            // Rimuovi il post dall'array
            this.posts.splice(index, 1);
            this.loadDelete[index] = false;
          }, error => {
            console.error('Errore durante l\'eliminazione del post:', error);
          });
        }
      });
    }
  

  cancelNewPost() {
    this.creatingPost = false;
  }
}
