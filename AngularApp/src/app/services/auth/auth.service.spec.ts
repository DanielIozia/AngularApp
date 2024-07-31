import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isLoggedIn as false by default', () => {
    expect(service.isLoggedIn).toBeFalse();
  });

  it('should login and store the token and user details in localStorage', () => {
    service.login('testToken', 'test@example.com', '1', 'male', 'active', 'John Doe');

    expect(localStorage.getItem('authToken')).toBe('testToken');
    expect(localStorage.getItem('email')).toBe('test@example.com');
    expect(localStorage.getItem('id')).toBe('1');
    expect(localStorage.getItem('gender')).toBe('male');
    expect(localStorage.getItem('status')).toBe('active');
    expect(localStorage.getItem('name')).toBe('John Doe');
    expect(service.isLoggedIn).toBeTrue();
  });

  it('should logout and clear the localStorage', () => {
    service.login('testToken', 'test@example.com', '1', 'male', 'active', 'John Doe');
    service.logout();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
    expect(localStorage.getItem('id')).toBeNull();
    expect(localStorage.getItem('gender')).toBeNull();
    expect(localStorage.getItem('status')).toBeNull();
    expect(localStorage.getItem('name')).toBeNull();
    expect(service.isLoggedIn).toBeFalse();
  });

  it('should return the correct token from localStorage', () => {
    localStorage.setItem('authToken', 'testToken');
    expect(service.getToken()).toBe('testToken');
  });

  it('should return the correct email from localStorage', () => {
    localStorage.setItem('email', 'test@example.com');
    expect(service.getEmail()).toBe('test@example.com');
  });

  it('should return the correct id from localStorage', () => {
    localStorage.setItem('id', '1');
    expect(service.getId()).toBe(1);
  });

  it('should return the correct name from localStorage', () => {
    localStorage.setItem('name', 'John Doe');
    expect(service.getName()).toBe('John Doe');
  });

  it('should return the correct gender from localStorage', () => {
    localStorage.setItem('gender', 'male');
    expect(service.getGender()).toBe('male');
  });

  it('should return the correct status from localStorage', () => {
    localStorage.setItem('status', 'active');
    expect(service.getStatus()).toBe('active');
  });
});
