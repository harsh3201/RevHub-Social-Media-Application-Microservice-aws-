import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'feed', component: DashboardComponent },
  { path: 'profile', component: DashboardComponent },
  { path: 'chat', component: DashboardComponent },
  { path: 'notifications', component: DashboardComponent },
  { path: 'create', component: DashboardComponent },
  { path: '**', redirectTo: '/auth/login' }
];
