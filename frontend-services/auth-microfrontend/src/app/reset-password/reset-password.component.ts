import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <h1 class="auth-logo">🚀 RevHub</h1>
          <h2 class="reset-title">Set New Password</h2>
          <p class="auth-subtitle">Enter the OTP sent to your email and create a new password</p>
        </div>
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required readonly>
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Enter OTP</mat-label>
            <input matInput formControlName="otp" required placeholder="Enter 6-digit code" maxlength="6">
            <mat-icon matPrefix>vpn_key</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input matInput type="password" formControlName="newPassword" required placeholder="Enter new password">
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" required placeholder="Confirm new password">
            <mat-icon matPrefix>lock_outline</mat-icon>
          </mat-form-field>
          <div *ngIf="resetForm.hasError('passwordMismatch') && resetForm.get('confirmPassword')?.touched" class="error-message">
            Passwords do not match
          </div>
          <button mat-raised-button color="primary" type="submit" [disabled]="!resetForm.valid" class="auth-btn">
            {{loading ? 'Resetting...' : 'Reset Password'}}
          </button>
          <p class="auth-link">
            <a routerLink="/auth/login" class="link-primary">← Back to Login</a>
          </p>
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
    .error-message { color: #EF4444; font-size: 12px; margin-top: -8px; }
  `]
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  loading = false;

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    // Get email from query params if available
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.resetForm.patchValue({ email: params['email'] });
      }
    });
  }

  passwordMatchValidator(form: any) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.loading = true;
    if (this.resetForm.valid) {
      const { email, otp, newPassword } = this.resetForm.value;
      this.http.post('http://3.231.75.61:8090/api/auth/reset-password', { email, otp, newPassword }).subscribe({
        next: (response: any) => {
          this.loading = false;
          alert('Password reset successfully! You can now login with your new password.');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          alert('Failed: ' + (error.error?.error || error.error?.message || 'Please try again'));
        }
      });
    }
  }
}
