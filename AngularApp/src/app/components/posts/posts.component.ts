import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/Post-interface';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Comment } from '../../interfaces/Comment-interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-post-delete-dialog/confirm-post-delete-dialog.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  id = this.auth.getId();
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  isLoading: boolean = true; 
  loadingCreatingComment: boolean = false;
  loadComments: boolean[] = [];
  loadDelete: boolean[] = [];
  loadPostss: boolean = true;
  loadingDelete: boolean = false;
  commentForm!: NgForm; 
  creatingPost: boolean = false;
  showComments: boolean[] = [];
  creatingNewPost: boolean = false;
  showtextError: boolean = false;
  textError: string = '';
  filterValue: string = '';
  currentPage: number = 1;
  oltre: boolean = true;
  primaPagina: boolean;
  postsPerPage: number = 10;
  postsPerPageOptions: number[] = [10, 25, 50, 75, 100];


  

  constructor(private postService: PostService, private auth: AuthService, private dialog: MatDialog) {
    this.currentPage = 1;
    this.primaPagina = true;
  }

  ngOnInit(): void {
    this.primaPagina = true;
    this.loadPosts();
  }

  public loadPosts() {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage).subscribe(
      (data: Post[]) => {
        this.posts = data;
        this.filteredPosts = data;
        this.isLoading = false;
      },
      error => {
        console.error('Errore durante il caricamento dei post:', error);
        this.isLoading = false;
      }
    );
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
  
    this.postService.addPostComment(id_post, comment).subscribe({
      next: (data: Comment) => {
        this.loadingCreatingComment = false;
        const postIndex = this.posts.findIndex(post => post.id === id_post);
        if (postIndex !== -1) {
          this.posts[postIndex].comments?.push(data);
        }
        form.reset();
      },
      error: () => {
        this.loadingCreatingComment = false; // Imposta su false anche in caso di errore
      }
    });
  }
  

  deletePost(post: Post, index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: post.title }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Se l'utente conferma l'eliminazione
        this.loadDelete[index] = true;
        this.postService.deletePost(post.id!).subscribe(() => {
          this.loadDelete[index] = false;
          this.loadUserPosts(); // Carica i post nuovamente dopo la cancellazione
        });
      }
    });
  }

  
  toggleComments(index: number) {
    // Assicurati che `showComments` sia inizializzato e abbia la lunghezza sufficiente
    if (!this.showComments) {
      this.showComments = [];
    }
    
    // Inizializza `showComments` per l'indice se non esiste
    if (typeof this.showComments[index] === 'undefined') {
      this.showComments[index] = false;
    }
  
    // Toggle `showComments` per l'indice
    this.showComments[index] = !this.showComments[index];
    
    // Verifica che `posts` e `posts[index]` siano definiti
    if (this.showComments[index] && this.posts && this.posts[index] && (!this.posts[index]!.comments || this.posts[index]!.comments!.length === 0)) {
      this.loadComments[index] = true;
      this.postService.getPostComments(this.posts[index].id!).subscribe((comments: Comment[]) => {
        this.loadComments[index] = false;
        this.posts[index].comments = comments;
      });
    }
  }

  loadUserPosts(): void {
    this.postService.getPosts().subscribe( (data: Post[]) => {
      this.loadPostss = false;
      this.posts = data;
      this.filteredPosts = data;
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

  createPost() {
    this.creatingPost = true;
  }

  cancelNewPost() {
    this.creatingPost = false;
  }

  submitNewPost(form: NgForm) {
    this.creatingNewPost = true;

    const newPost: Post = {
      user_id: this.auth.getId(),
      title: form.value.title,
      body: form.value.body,
    };

    this.postService.addUserPost(newPost).subscribe( (data: Post) => {
      this.creatingNewPost = false;
      this.posts.unshift(data);// Carica i post nuovamente dopo la creazione di un nuovo post
      this.creatingPost = false;
      form.reset();
      this.loadUserPosts();   
    }, error => {
      this.creatingNewPost = false;
      this.showtextError = true;
      form.reset();
      this.textError = "post update error"
    });
  }

  //form di ricerca
  applyFilter() {
    this.filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(this.filterValue.toLowerCase())
    );
    console.log(this.filteredPosts);
  }

  clearFilter() {
    this.filterValue = '';
    this.filteredPosts = this.posts;
  }

  previousPage() {
    this.clearFilter();
    if (this.currentPage == 2) {
      this.primaPagina = true;
    }
    if (this.currentPage != 1) {
      this.currentPage--;
      if (!this.oltre) {
        this.oltre = true;
      }
      this.loadPosts();
    } else {
      this.primaPagina = false;
    }
  }

  nextPage() {
    this.isLoading = true;
    this.clearFilter();
    this.postService.getPosts(this.currentPage + 1, this.postsPerPage).subscribe((data: Post[]) => {
      if (data.length != 0) {
        this.primaPagina = false;
        this.oltre = true;
        this.posts = data;
        this.currentPage++;
        this.filteredPosts = data;
        this.isLoading = false;
      } 
      else {
        this.oltre = false;
      }
    });
  }
  

  onPostsPerPageChange(event: any) {
    this.postsPerPage = event.value;
    this.currentPage = 1;
    this.loadPosts();
  }

 

  scrollToBottom() {
    const paginatorElement = document.getElementById('paginator');
    if (paginatorElement) {
        paginatorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
  
   
}
