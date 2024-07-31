import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { AuthService } from './auth/auth.service';

import { Post } from '../interfaces/Post-interface';
import { Comment } from '../interfaces/Comment-interface';


describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService, AuthService]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts', () => {
    const dummyPosts: Post[] = [
      { id: 1, user_id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, user_id: 1, title: 'Post 2', body: 'Body 2' }
    ];
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.POSTS_SEGMENT}${service.access_token}${token}&page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should fetch post comments', () => {
    const dummyComments: Comment[] = [
      { id: 1, postId: 1, userId:1, name: 'Comment 1', email: 'email1@example.com', body: 'Body 1' },
      { id: 2, postId: 1, userId:2, name: 'Comment 2', email: 'email2@example.com', body: 'Body 2' }
    ];
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.getPostComments(1).subscribe(comments => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(dummyComments);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.POSTS_SEGMENT}/1${service.COMMENT_SEGMENT}${service.access_token}${token}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyComments);
  });

  it('should add post comment', () => {
    const dummyComment: Comment = { id: 1, postId: 1, userId:1, name: 'Comment 1', email: 'email1@example.com', body: 'Body 1' };
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.addPostComment(1, dummyComment).subscribe(comment => {
      expect(comment).toEqual(dummyComment);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.POSTS_SEGMENT}/1${service.COMMENT_SEGMENT}${service.access_token}${token}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyComment);
  });

  it('should add user post', () => {
    const dummyPost: Post = { id: 1, user_id: 1, title: 'Post 1', body: 'Body 1' };
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);
    spyOn(authService, 'getId').and.returnValue(1);

    service.addUserPost(dummyPost).subscribe(post => {
      expect(post).toEqual(dummyPost);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}/1${service.POSTS_SEGMENT}${service.access_token}${token}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyPost);
  });

  it('should delete post', () => {
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.deletePost(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.POSTS_SEGMENT}/1${service.access_token}${token}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
