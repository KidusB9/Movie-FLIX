import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  userInfoForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.userInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthday: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],

    });
  }


  onSubmit() {
    if (this.userInfoForm.valid) {
        const userInfo = this.userInfoForm.value;
        const userId = this.userService.getUserId(); // Retrieve the user ID

        console.log(`User ID retrieved for update: ${userId}`);

        if (!userId) {
            console.error('User ID is not available for update.');
            return;
        }

        this.userService.updateUserInfo({ ...userInfo, userId }).subscribe({
            next: (response) => {
                console.log('User Info Updated:', response);
                this.router.navigate(['/register/plan']);
            },
            error: (error) => {
                console.error('Update Error:', error);
            }
        });
    } else {
        console.error('Form is invalid.');
    }
  }
}


//   onSubmit() {
//     if (this.userInfoForm.valid) {
//       const userInfo = this.userInfoForm.value;


//       const userId = 'the-users-id';  //dynamically retrieved

//       this.userService.updateUserInfo(userId, userInfo).subscribe({
//         next: (response) => {
//           console.log('User Info Updated:', response);
//           this.router.navigate(['/register']);
//         },
//         error: (error) => {
//           console.error('Update Error:', error);
//         }
//       });
//     }
//   }
// }




