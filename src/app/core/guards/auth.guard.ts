import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ensure this path is correct
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Using the authService to determine if the user is authenticated
    return this.authService.isLoggedIn$.pipe(
      take(1), // Take the first value emitted and complete
      map(isLoggedIn => {
        if (isLoggedIn) {
          // If the user is authenticated, allow access
          return true;
        } else {
          // If not authenticated, redirect to login page with the attempted URL for future redirection
          const url: string = state.url;
          this.storeRedirectUrl(url); // Store the URL for redirecting after login
          this.router.navigate(['/login'], { queryParams: { redirectUrl: url } });
          return false;
        }
      })
    );
  }

  private storeRedirectUrl(url: string): void {
    localStorage.setItem('redirectUrl', url); // Consider moving this logic inside AuthService for encapsulation
  }
}
