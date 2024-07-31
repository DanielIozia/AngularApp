/*
Cosa fa questo file di test:
Configurazione del test: Configura TestBed per includere HttpClientTestingModule e fornisce i servizi necessari (UserService e AuthService).
Creazione del servizio: Verifica che il servizio UserService sia creato correttamente.
Test dei metodi del servizio:
getUsers: Verifica che il metodo recuperi un elenco di utenti.
createUser: Verifica che il metodo crei un nuovo utente.
getUserById: Verifica che il metodo recuperi un utente per ID.
getUserPosts: Verifica che il metodo recuperi i post di un utente per ID.
deleteUser: Verifica che il metodo cancelli un utente.
updateUser: Verifica che il metodo aggiorni un utente.
Questi test assicurano che il UserService funzioni come previsto, simulando le chiamate HTTP e verificando le risposte attese.
 */


import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { User } from '../interfaces/User-interface';
import { Post } from '../interfaces/Post-interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, AuthService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const dummyUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', gender: 'female', status: 'inactive' }
    ];
    const token = 'testToken';

    service.getUsers(token).subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}${service.access_token + token}&page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should create user', () => {
    const dummyUser: User = { id: 3, name: 'Sam Smith', email: 'sam@example.com', gender: 'male', status: 'active' };
    const token = 'testToken';

    service.createUser(dummyUser, token).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}${service.access_token}${token}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUser);
  });

  it('should fetch user by ID', () => {
    const dummyUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' };
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}/1${service.access_token}${token}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should fetch posts by user ID', () => {
    const dummyPosts: Post[] = [
      { id: 1, user_id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, user_id: 1, title: 'Post 2', body: 'Body 2' }
    ];
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.getUserPosts(1).subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}/1${service.POSTS_SEGMENT}${service.access_token}${token}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should delete user', () => {
    const dummyUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' };
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);

    service.deleteUser(1).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}/1${service.access_token}${token}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyUser);
  });

  it('should update user', () => {
    const dummyUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active' };
    const token = 'testToken';
    spyOn(authService, 'getToken').and.returnValue(token);
    spyOn(authService, 'getId').and.returnValue(1);

    service.updateUser(dummyUser).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service.BASE_URL}${service.USER_SEGMENT}/1${service.access_token}${token}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyUser);
  });
});
