import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <h1 class="auth-logo">🚀 RevHub</h1>
          <p class="auth-subtitle">Welcome back! Login to continue</p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" required>
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid" class="auth-btn">
            {{loading ? 'Loading...' : 'Login'}}
          </button>
          <p class="auth-link">Don't have an account? <a routerLink="/auth/register" class="link-primary">Sign up</a></p>
          <p class="auth-link forgot-link">🔑 <a routerLink="/auth/forgot-password" class="link-secondary">Forgot Password?</a></p>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
    .auth-card { width: 100%; max-width: 450px; padding: 40px; border-radius: 16px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2); }
    .auth-header { text-align: center; margin-bottom: 30px; }
    .auth-logo { font-size: 32px; font-weight: 700; color: #8B5CF6; margin: 0; }
    .auth-subtitle { color: #6B7280; margin-top: 8px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .full-width { width: 100%; }
    .auth-btn { width: 100%; height: 48px; font-size: 16px; font-weight: 600; border-radius: 8px; }
    .auth-link { text-align: center; margin-top: 16px; color: #6B7280; }
    .forgot-link { margin-top: 8px; font-size: 14px; }
    .link-primary { color: #4A90E2; text-decoration: none; font-weight: 600; }
    .link-primary:hover { text-decoration: underline; }
    .link-secondary { color: #6B7280; text-decoration: none; }
    .link-secondary:hover { text-decoration: underline; color: #4A90E2; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  loading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    this.loading = true;
    if (this.loginForm.valid) {
      this.http.post('http://localhost:8090/api/users/login', this.loginForm.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.loading = false;
          this.router.navigate(['/feed']);
        },
        error: (error) => {
          this.loading = false;
          alert('Login failed: ' + (error.error?.message || 'Please try again'));
        }
      });
    }
  }
}
