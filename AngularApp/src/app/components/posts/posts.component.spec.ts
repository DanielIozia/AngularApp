import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Post } from '../../interfaces/Post-interface';
import { Comment } from '../../interfaces/Comment-interface';
import { ConfirmDialogComponent } from '../../components/confirm-post-delete-dialog/confirm-post-delete-dialog.component';

// Mock per NgForm
class MockNgForm {
  reset() {}
  value = {
    comment: 'Test comment'
  };
}

// Mock della classe PostService
class MockPostService {
  getPosts() {
    return of([]);
  }
  getPostComments() {
    return of([]);
  }
  addPostComment() {
    return of({});
  }
  addUserPost() {
    return of({});
  }
  deletePost() {
    return of({});
  }
}

// Mock della classe AuthService
class MockAuthService {
  getId() {
    return 1;
  }
  getName() {
    return 'Test User';
  }
  getEmail() {
    return 'test@example.com';
  }
  getToken() {
    return 'test-token';
  }
}

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postService: PostService;
  let authService: AuthService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: PostService, useClass: MockPostService },
        { provide: AuthService, useClass: MockAuthService },
        MatDialog
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora i tag sconosciuti nel template
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    const spy = spyOn(postService, 'getPosts').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should add a comment', () => {
    const spy = spyOn(postService, 'addPostComment').and.returnValue(of({} as Comment));
    component.addComment(new MockNgForm() as NgForm, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should delete a post', () => {
    const deletePostSpy = spyOn(postService, 'deletePost').and.returnValue(of({}));
    const dialogRefSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)  // Simula una risposta di conferma (true)
    } as any);
    component.deletePost({ id: 1 } as Post, 0);
    expect(deletePostSpy).toHaveBeenCalled();
  });

  it('should handle filter correctly', () => {
    component.posts = [{ id: 1, user_id: 1, title: 'Test Post', body: 'Test Body' }];
    component.filterValue = 'Test';
    component.applyFilter();
    expect(component.filteredPosts.length).toBe(1);
  });

  it('should increment currentPage if there are posts', () => {
    component.currentPage = 2;
    const spy = spyOn(postService, 'getPosts').and.returnValue(of([{ id: 1, user_id: 1, title: 'Test Post', body: 'Test Body' }] as Post[]));
    component.nextPage();
    expect(spy).toHaveBeenCalledWith(3, component.postsPerPage);
    expect(component.currentPage).toBe(3);
  });

  it('should not increment currentPage if there are no posts', () => {
    component.currentPage = 2;
    const spy = spyOn(postService, 'getPosts').and.returnValue(of([] as Post[]));
    component.nextPage();
    expect(spy).toHaveBeenCalledWith(3, component.postsPerPage);
    expect(component.currentPage).toBe(2);
  });

  it('should handle errors on loading posts', () => {
    spyOn(postService, 'getPosts').and.returnValue(throwError(() => new Error('Error')));
    component.loadPosts();
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors on adding comment', () => {
    spyOn(postService, 'addPostComment').and.returnValue(throwError(() => new Error('Error')));
    component.addComment(new MockNgForm() as NgForm, 1);
    expect(component.loadingCreatingComment).toBeFalse();
  });

  it('should show and hide comments', () => {
    component.posts = [{ id: 1, user_id: 1, title: 'Test Post', body: 'Test Body', comments: [] }];
    component.showComments = [false];
    spyOn(postService, 'getPostComments').and.returnValue(of([]));
    component.toggleComments(0);
    expect(component.showComments[0]).toBeTrue();
  });

  it('should reset form on cancel new post', () => {
    component.cancelNewPost();
    expect(component.creatingPost).toBeFalse();
  });

  it('should create a new post', () => {
    const spy = spyOn(postService, 'addUserPost').and.returnValue(of({} as Post));
    component.submitNewPost(new MockNgForm() as NgForm);
    expect(spy).toHaveBeenCalled();
  });
});
