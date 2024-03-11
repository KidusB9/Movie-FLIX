import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-plan-selection-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],

  templateUrl: './plan-selection-page.component.html',
  styleUrls: ['./plan-selection-page.component.scss']

})
export class PlanSelectionPageComponent {
  planForm: FormGroup;

  constructor(private fb: FormBuilder, @Inject(UserService) private userService: UserService, private router: Router) {
    this.planForm = this.fb.group({
      plan: ['', Validators.required]
    });
  }

  // Inside your RegisterPageComponent
  onSubmit() {
    if (this.planForm.valid) {
      // Store the selected plan in local storage instead of registering the user
      const selectedPlan = this.planForm.value.plan; // Assuming 'plan' is the form control name for the plan
      localStorage.setItem('selectedPlan', selectedPlan);

      // Navigate to the registration page for the user to complete their registration
      this.router.navigate(['/register']);
    }
  }
}

