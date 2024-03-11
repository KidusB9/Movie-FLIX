import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    LoginPageComponent
  ]
})
export class LoginPageModule { }
