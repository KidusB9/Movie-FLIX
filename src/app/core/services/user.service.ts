// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = 'http://localhost:3000/api/users';
//   private userId: string;

//   constructor(private http: HttpClient) {}

//   login(credentials: { email: string; password: string }): Observable<any> {
//     console.log(credentials);
//     return this.http.post(`${this.apiUrl}/login`, credentials);
//   }

//   register(usermovies: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, usermovies, { withCredentials: true });
// }
// setUserId(id: string) {
//   this.userId = id;
// }
// getUserId(): string {
//   return this.userId;
// }



// selectPlan(userId: string, plan: string): Observable<any> {
//   return this.http.patch(`${this.apiUrl}/${userId}/plan`, { plan }, { withCredentials: true });
// }

//   // selectPlan(userId: string, planmovies: { plan: string }): Observable<any> {
//   //   // when we have an endpoint to update a user's plan
//   //   // we have  need to adjust this depending based on the how backend is set up
//   //   return this.http.patch(`${this.apiUrl}/${userId}/plan`, planmovies, { withCredentials: true });
//   // }

//   updateUserInfo(userInfo: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/user/update`, userInfo, { withCredentials: true });
// }

//   }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private userId: string;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('Logging in with credentials:', credentials);
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(response => {

        console.log('Login successful, user data:', response);
        // const id = response.user?._id;
        const id = response._id;
        this.setUserId(id);
        console.log(`User ID set after login: ${id}`);
      })
    );
  }

  register(user: { email: string; password: string }): Observable<any> {
    console.log('Registering user:', user);
    return this.http.post<any>(`${this.apiUrl}/register`, user, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Registration successful, user data:', response);
        const id = response.user?._id; // Make sure this matches the actual response structure
        if (id) {
          this.setUserId(id);
          console.log(`User ID set after registration: ${id}`);
        } else {
          console.error('User ID not found in registration response');
        }
      })
    );
  }


  setUserId(id: string) {
    this.userId = id;
    console.log('Set user ID:', this.userId);
  }

  getUserId(): string {
    console.log('Get user ID:', this.userId);
    return this.userId;
  }



  updateUserInfo(userInfo: any): Observable<any> {
    console.log('Updating user info:', userInfo);
    return this.http.put(`${this.apiUrl}/user/update`, userInfo, { withCredentials: true });
  }

  selectPlan(userId: string, plan: string): Observable<any> {
    console.log(`Selecting plan for user ${userId} with plan ${plan}`);
    return this.http.put(`${this.apiUrl}/users/${userId}/plan`, { plan }, { withCredentials: true });
}
}



