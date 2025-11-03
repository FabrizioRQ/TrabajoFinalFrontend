import { Routes } from '@angular/router';
import {LoginComponent} from './login-component/login-component';
import {RegisterComponent} from './register-component/register-component';
import {ForgotPasswordComponent} from './forgot-password-component/forgot-password-component';
import {LandingPageComponent} from './landing-page-component/landing-page-component';
import {AdminPanelComponent} from './admin-panel-component/admin-panel-component';
import {UserPanelComponent} from './user-panel-component/user-panel-component';


export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recuperacion', component: ForgotPasswordComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'user-panel', component: UserPanelComponent },
  { path: '**', redirectTo: 'landing' }
];
