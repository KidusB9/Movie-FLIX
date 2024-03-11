import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log(credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(usermovies: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}/register`, usermovies);
  }

  selectPlan(userId: string, planmovies: { plan: string }): Observable<any> {
    // when we have an endpoint to update a user's plan
    // we have  need to adjust this depending based on the how backend is set up
    return this.http.patch(`${this.apiUrl}/${userId}/plan`, planmovies);
  }
}
