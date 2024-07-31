import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Post } from '../../interfaces/Post-interface';
import { NgForm } from '@angular/forms';
import { Comment } from '../../interfaces/Comment-interface';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let postService: jasmine.SpyObj<PostService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserPosts']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getId', 'getEmail', 'getName', 'getGender', 'getStatus', 'getToken', 'login']);
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostComments', 'addPostComment', 'addUserPost', 'deletePost']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PostService, useValue: postServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignores errors related to unrecognized elements and attributes
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock the services
    authService.getId.and.returnValue(1);
    authService.getEmail.and.returnValue('test@example.com');
    authService.getName.and.returnValue('John Doe');
    authService.getGender.and.returnValue('male');
    authService.getStatus.and.returnValue('active');
    authService.getToken.and.returnValue('fake-token');

    userService.getUserPosts.and.returnValue(of([{ id: 1, user_id: 1, title: 'Test Post', body: 'This is a test post', comments: [] } as Post]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user posts on init', () => {
    expect(userService.getUserPosts).toHaveBeenCalledWith(1);
    expect(component.posts.length).toBe(1);
  });

  it('should toggle comments visibility', () => {
    const post: Post = { id: 1, user_id: 1, title: 'Test Post', body: 'This is a test post', comments: [] };
    component.posts = [post];
    component.showComments = [false];
  
    // Mock della risposta da getPostComments
    postService.getPostComments.and.returnValue(of([]));
  
    component.toggleComments(0);
  
    expect(component.showComments[0]).toBeTrue();
    expect(postService.getPostComments).toHaveBeenCalledWith(post.id!);
  });
  

  it('should add a comment', () => {
    // Crea un mock per NgForm con un metodo `reset` come spy
    const form = { value: { comment: 'New Comment' }, reset: jasmine.createSpy('reset') } as unknown as NgForm;
    const postId = 1;
    const comment: Comment = {
      id: 1,
      postId: postId,
      userId: 1,
      name: 'John Doe',
      email: 'test@example.com',
      body: 'New Comment'
    };
  
    // Mock del servizio per aggiungere un commento
    postService.addPostComment.and.returnValue(of(comment));
  
    // Chiama il metodo `addComment`
    component.addComment(form, postId);
  
    // Verifica che `addPostComment` sia stato chiamato con i parametri corretti
    expect(postService.addPostComment).toHaveBeenCalledWith(postId, comment);
  
    // Verifica che `loadingCreatingComment` sia stato impostato su false
    expect(component.loadingCreatingComment).toBeFalse();
  
    // Verifica che il commento sia stato aggiunto al post
    expect(component.posts[0].comments?.length).toBe(1);
  
    // Verifica che il metodo `reset` sia stato chiamato
    expect(form.reset).toHaveBeenCalled();
  });
  

  it('should handle error when adding a comment', () => {
    const form = { value: { comment: 'New Comment' } } as NgForm;
    const postId = 1;

    postService.addPostComment.and.returnValue(throwError('Error'));

    component.addComment(form, postId);

    expect(component.loadingCreatingComment).toBeFalse();
    expect(component.textError).toBe('post update error');
  });

  it('should open profile edit dialog', () => {
    const dialogRef = { afterClosed: () => of({ name: 'New Name', email: 'newemail@example.com', gender: 'female', status: 'inactive' }) } as any;
    dialog.open.and.returnValue(dialogRef);

    component.update();

    expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({ width: '80%', maxWidth: '600px' }));
  });


  
  it('should delete a post', () => {
    const post: Post = { id: 1, user_id: 1, title: 'Test Post', body: 'This is a test post' };
    const index = 0;

    const dialogRef = { afterClosed: () => of(true) } as any;
    dialog.open.and.returnValue(dialogRef);
    postService.deletePost.and.returnValue(of({}));

    component.deletePost(post, index);

    expect(postService.deletePost).toHaveBeenCalledWith(post.id!);
    expect(component.loadDelete[index]).toBeFalse();
    expect(component.posts.length).toBe(0);
  });

  it('should cancel creating a post', () => {
    component.cancelNewPost();
    expect(component.creatingPost).toBeFalse();
  });


});
