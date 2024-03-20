import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,  // Using UserService instead of AuthService for user-related operations
    private router: Router
  ) {
    this.planForm = this.fb.group({
      plan: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Plan selection form submission triggered.');

    if (this.planForm.valid) {
        const selectedPlan = this.planForm.value.plan;
        console.log(`Selected plan from form: ${selectedPlan}`);

        const userId = this.userService.getUserId();
        console.log(`User ID retrieved for plan selection: ${userId}`);

        if (!userId) {
            console.error('User ID is not available for plan selection.');
            return;
        }

        console.log(`Initiating plan selection for user ${userId} with plan ${selectedPlan}`);
        this.userService.selectPlan(userId, selectedPlan).subscribe({
            next: () => {
                console.log(`Plan selection successful for user ${userId} with plan ${selectedPlan}`);
                this.router.navigate(['/movies']);  // Navigate to the movies page upon successful plan selection
            },
            error: (error) => {
                console.error(`Plan selection error for user ${userId} with plan ${selectedPlan}:`, error);
            }
        });
    } else {
        console.error('Form is invalid:', this.planForm.errors);
    }
}

}
