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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <h1 class="auth-logo">🚀 RevHub</h1>
          <p class="auth-subtitle">{{showOtp ? 'Verify Your Email' : 'Create your account'}}</p>
        </div>
        
        <form *ngIf="!showOtp" [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>
          <div style="display: flex; gap: 10px;">
            <mat-form-field appearance="outline" style="flex: 1;">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>
            <mat-form-field appearance="outline" style="flex: 1;">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.valid" class="auth-btn">
            {{loading ? 'Creating Account...' : 'Register'}}
          </button>
          <p class="auth-link">Already have an account? <a routerLink="/auth/login" class="link-primary">Login</a></p>
        </form>
        
        <form *ngIf="showOtp" [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()" class="auth-form">
          <p style="text-align: center; color: #6B7280; margin-bottom: 20px;">
            We've sent a 6-digit OTP to<br><strong>{{userEmail}}</strong>
          </p>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Enter OTP</mat-label>
            <input matInput formControlName="otp" maxlength="6" required>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!otpForm.valid" class="auth-btn">
            {{loading ? 'Verifying...' : 'Verify OTP'}}
          </button>
          <p class="auth-link">Didn't receive OTP? <a href="#" class="link-primary">Resend</a></p>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
    .auth-card { width: 100%; max-width: 500px; padding: 40px; border-radius: 16px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2); }
    .auth-header { text-align: center; margin-bottom: 30px; }
    .auth-logo { font-size: 32px; font-weight: 700; color: #8B5CF6; margin: 0; }
    .auth-subtitle { color: #6B7280; margin-top: 8px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .full-width { width: 100%; }
    .auth-btn { width: 100%; height: 48px; font-size: 16px; font-weight: 600; border-radius: 8px; }
    .auth-link { text-align: center; margin-top: 16px; color: #6B7280; }
    .link-primary { color: #4A90E2; text-decoration: none; font-weight: 600; }
    .link-primary:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  loading = false;
  showOtp = false;
  userEmail = '';

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.http.post('http://3.231.75.61:8090/api/auth/register', this.registerForm.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.userEmail = this.registerForm.value.email || '';
          this.showOtp = true;
          alert('OTP sent to your email!');
        },
        error: (error) => {
          this.loading = false;
          alert('Registration failed: ' + (error.error?.error || error.error?.message || 'Please try again'));
        }
      });
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.loading = true;
      this.http.post('http://3.231.75.61:8090/api/auth/verify-otp', {
        email: this.userEmail,
        otp: this.otpForm.value.otp
      }).subscribe({
        next: (response: any) => {
          this.loading = false;
          alert('Email verified successfully! Please login.');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          alert('OTP verification failed: ' + (error.error?.error || 'Invalid OTP'));
        }
      });
    }
  }
}
