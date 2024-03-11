import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';


import { UserService } from '../../../../core/services/user.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports:  [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  // constructor(private fb: FormBuilder, @Inject(UserService) private authService: AuthService, private router: Router) {}
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // the key matches the one checked by on AuthGuard
          // localStorage.setItem('authToken', response.token);
          localStorage.setItem('token', response.token);

          this.router.navigate(['/movies']);
        },
        error: (error) => {
          console.error('Login failed', error);
          // Set the error message
          this.errorMessage = 'Login failed. Please register first if you are a new user.';
        }
      });
    }
  }
}
