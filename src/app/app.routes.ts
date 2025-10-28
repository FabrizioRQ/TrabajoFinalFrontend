import { Routes } from '@angular/router';
import {LoginComponent} from './login-component/login-component';
import {RegisterComponent} from './register-component/register-component';
import {ForgotPasswordComponent} from './forgot-password-component/forgot-password-component';

export const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"recuperacion", component:ForgotPasswordComponent},
];
