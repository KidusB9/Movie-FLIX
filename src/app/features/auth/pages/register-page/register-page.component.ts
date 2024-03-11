import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']

})
export class RegisterPageComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, @Inject(UserService) private userService: UserService, private router: Router)  {
    // Initialize form group with form controls
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Inside your RegisterPageComponent
onSubmit() {
  if (this.registerForm.valid) {

    const plan = localStorage.getItem('selectedPlan'); // Assuming plan is stored in local storage
    const registrationData = {
      ...this.registerForm.value,
      plan: plan // Include the plan in the registration payload
    };
    // this.userService.register(this.registerForm.value).subscribe({
      this.userService.register(registrationData).subscribe({
      next: (response) => {
        console.log('User registered', response);
        // Optionally log the user in directly and navigate to a protected page

        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/movies']);
      },
      error: (error) => console.error('Registration error', error)
    });
  }
}
}

