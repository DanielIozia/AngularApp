import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { User } from '../../interfaces/User-interface';
import { Post } from '../../interfaces/Post-interface';
import { Comment } from '../../interfaces/Comment-interface';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUserById', 'getUserPosts']);
    const postServiceMock = jasmine.createSpyObj('PostService', ['getPostComments', 'addPostComment']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getId', 'getName', 'getEmail', 'getToken']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' };
    const mockPosts: Post[] = [
      { id: 1, user_id: 1, title: 'Post 1', body: 'Post 1 body', comments: [] },
      { id: 2, user_id: 1, title: 'Post 2', body: 'Post 2 body', comments: [] }
    ];

    userServiceSpy.getUserById.and.returnValue(of(mockUser));
    userServiceSpy.getUserPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.isLoading).toBeFalse();

    expect(userServiceSpy.getUserPosts).toHaveBeenCalledWith(1);
    expect(component.posts).toEqual(mockPosts);
    expect(component.loadPosts).toBeFalse();
    expect(component.showComments.length).toBe(2);
    expect(component.loadComments.length).toBe(2);
    expect(component.loadDelete.length).toBe(2);
  });

  it('should load user posts on init', () => {
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' };
    const mockPosts: Post[] = [
      { id: 1, user_id: 1, title: 'Post 1', body: 'Post 1 body', comments: [] },
      { id: 2, user_id: 1, title: 'Post 2', body: 'Post 2 body', comments: [] }
    ];

    userServiceSpy.getUserById.and.returnValue(of(mockUser));
    userServiceSpy.getUserPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.isLoading).toBeFalse();

    expect(userServiceSpy.getUserPosts).toHaveBeenCalledWith(1);
    expect(component.posts).toEqual(mockPosts);
    expect(component.loadPosts).toBeFalse();
    expect(component.showComments.length).toBe(2);
    expect(component.loadComments.length).toBe(2);
    expect(component.loadDelete.length).toBe(2);
  });

  it('should handle add comment', () => {
    const mockComment = { id: 1, postId: 1, userId: 1, name: 'John Doe', email: 'john@example.com', body: 'Nice post!' };
    postServiceSpy.addPostComment.and.returnValue(of(mockComment));
    authServiceSpy.getId.and.returnValue(1);
    authServiceSpy.getName.and.returnValue('John Doe');
    authServiceSpy.getEmail.and.returnValue('john@example.com');

    const mockForm = {
      value: { comment: 'Nice post!' },
      reset: jasmine.createSpy('reset')
    } as any as NgForm;

    component.posts = [{ id: 1, user_id: 1, title: 'Post 1', body: 'Post 1 body', comments: [] }];

    component.addComment(mockForm, 1);

    expect(postServiceSpy.addPostComment).toHaveBeenCalledWith(1, jasmine.objectContaining({ body: 'Nice post!' }));
    expect(component.loadingCreatingComment).toBeFalse();
    expect(component.posts[0].comments).toContain(mockComment);
    expect(mockForm.reset).toHaveBeenCalled();
  });

  it('should toggle comments visibility', () => {
    const mockComments:Comment[] = [
      { id: 1, postId: 1, userId: 1, name: 'John Doe', email: 'john@example.com', body: 'Nice post!' }
    ];
    postServiceSpy.getPostComments.and.returnValue(of(mockComments));

    component.posts = [{ id: 1, user_id: 1, title: 'Post 1', body: 'Post 1 body', comments: [] }];
    component.showComments = [false];

    component.toggleComments(0);

    expect(component.showComments[0]).toBeTrue();
    expect(postServiceSpy.getPostComments).toHaveBeenCalledWith(1);
    expect(component.posts[0].comments).toEqual(mockComments);
  });
});
