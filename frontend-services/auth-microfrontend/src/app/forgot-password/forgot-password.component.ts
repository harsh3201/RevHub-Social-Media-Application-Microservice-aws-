import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <h1 class="auth-logo">🚀 RevHub</h1>
          <h2 class="reset-title">Reset Password</h2>
          <p class="auth-subtitle">Enter your email to receive a password reset link</p>
        </div>
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Enter your email</mat-label>
            <input matInput type="email" formControlName="email" required placeholder="your@email.com">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!resetForm.valid" class="auth-btn">
            {{loading ? 'Sending...' : 'Send Reset Link'}}
          </button>
          <p class="auth-link">
            <a routerLink="/auth/login" class="link-primary">← Back to Login</a>
          </p>
          <div *ngIf="successMessage" class="success-message">
            {{successMessage}}
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .auth-card { width: 100%; max-width: 450px; padding: 40px; border-radius: 16px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3); background: white; }
    .auth-header { text-align: center; margin-bottom: 30px; }
    .auth-logo { font-size: 32px; font-weight: 700; color: #8B5CF6; margin: 0 0 10px 0; }
    .reset-title { font-size: 24px; font-weight: 600; color: #1F2937; margin: 0 0 8px 0; }
    .auth-subtitle { color: #6B7280; margin-top: 8px; font-size: 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .full-width { width: 100%; }
    .auth-btn { width: 100%; height: 48px; font-size: 16px; font-weight: 600; border-radius: 8px; background: #4A90E2; }
    .auth-link { text-align: center; margin-top: 16px; color: #6B7280; }
    .link-primary { color: #4A90E2; text-decoration: none; font-weight: 600; }
    .link-primary:hover { text-decoration: underline; }
    .success-message { padding: 12px; background: #10B981; color: white; border-radius: 8px; text-align: center; margin-top: 16px; }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  loading = false;
  successMessage = '';

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email || '';
      this.http.post('http://localhost:8090/api/auth/forgot-password', { email }).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.successMessage = 'OTP sent to your email! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/auth/reset-password'], { queryParams: { email } });
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          alert('Failed to send OTP: ' + (error.error?.error || error.error?.message || 'Please try again'));
        }
      });
    }
  }
}
