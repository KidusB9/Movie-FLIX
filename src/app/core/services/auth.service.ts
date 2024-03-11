import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // HttpHeaders removed since we're using an interceptor now

import { UserService } from './user.service';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private userService: UserService, private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.userService.login(credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login Error:', error);
        return throwError(() => error); // Rethrow error to be handled by the component
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  // Added method to update user information
  updateUserInfo(userInfo: any): Observable<any> {
    return this.http.put('/api/user/update', userInfo).pipe(
      tap((response: any) => {
        // Assuming your API returns a new token in response.token
        localStorage.setItem('token', response.token);
        // Optionally update isLoggedInSubject or other parts of your application state as needed
        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Update User Info Error:', error);
        return throwError(() => error);
      })
    );
  }
}
