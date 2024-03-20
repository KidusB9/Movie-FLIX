import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  user: {
    _id: string;

  };

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Use ReplaySubject to ensure the latest value is emitted to subscribers upon subscription
  private userIdSubject = new ReplaySubject<string | null>(1);
  userId$ = this.userIdSubject.asObservable();

  private userId: string;

  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  register(credentials: { email: string; password: string; plan: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/users/register`, credentials, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Registration successful', response);
        if (response.user && response.user._id) {
          this.userIdSubject.next(response.user._id);
          this.isLoggedInSubject.next(true);
        } else {
          console.error('User ID is missing in the response');
        }
      }),
      catchError((error) => {
        console.error('Registration error', error);
        return throwError(() => error);
      })
    );
  }


  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/users/login`, credentials, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Login successful', response);
        this.userIdSubject.next(response.user?._id);

        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login Error:', error);
        return throwError(() => error);
      })
    );
  }

  selectPlan(plan: string): Observable<any> {
    if (!this.userId) {
      console.error('User ID is not set in AuthService');
      return throwError(() => new Error('User ID is not set'));
    }

    console.log(`Selecting plan for user ${this.userId} with plan ${plan}`);
    return this.http.patch(`${this.baseUrl}/api/users/${this.userId}/plan`, { plan }, { withCredentials: true }).pipe(
      tap(response => {
        console.log(`Plan selected successfully for user ${this.userId}:`, response);
      }),
      catchError(error => {
        console.error(`Error selecting plan for user ${this.userId}:`, error);
        return throwError(() => error);
      })
    );
  }


  logout(): void {
    this.http.post(`${this.baseUrl}/api/users/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.isLoggedInSubject.next(false);
        this.userIdSubject.next(null);  // Clear the user ID on logout
      },
      error: (error) => {
        console.error('Logout Error:', error);
      }
    });
  }

  updateUserInfo(userInfo: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/update`, userInfo, { withCredentials: true }).pipe(
      tap(() => {
        console.log('User info update successful');
        // Consider if you need to do anything with the isLoggedInSubject here
      }),
      catchError((error) => {
        console.error('Update User Info Error:', error);
        return throwError(() => error);
      })
    );
  }
}
