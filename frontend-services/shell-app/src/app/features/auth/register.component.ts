import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="d-flex justify-content-center align-items-center min-vh-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div class="col-md-4 col-lg-3">
    <div class="text-center mb-5">
      <div class="d-inline-block p-4 rounded-circle" style="background: linear-gradient(135deg, #667eea, #764ba2); box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);">
        <i class="fas fa-rocket fa-3x text-white"></i>
      </div>
      <h1 class="mt-3 mb-0 fw-bold" style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.5rem;">
        RevHub
      </h1>
      <p class="text-white mt-2">{{showOtp ? 'Verify Your Email' : 'Join the Revolution'}}</p>
    </div>
    
    <div class="card glass-card" style="border: none; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1); background: rgba(255, 255, 255, 0.95); border-radius: 20px;">
      <div class="card-body p-4">
        <h3 class="card-title text-center mb-4 fw-bold">{{showOtp ? 'Enter OTP' : 'Create Account'}}</h3>
        
        <form *ngIf="!showOtp" (ngSubmit)="register()">
          <div class="mb-4">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0">
                <i class="fas fa-user text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control border-start-0" 
                placeholder="Choose a username" 
                [(ngModel)]="username"
                name="username"
                required
                style="padding-left: 0;">
            </div>
            <small class="text-muted">This will be your unique identifier</small>
          </div>
          
          <div class="mb-4">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0">
                <i class="fas fa-envelope text-muted"></i>
              </span>
              <input 
                type="email" 
                class="form-control border-start-0" 
                placeholder="Enter your email" 
                [(ngModel)]="email"
                name="email"
                required
                style="padding-left: 0;">
            </div>
          </div>
          
          <div class="mb-4">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0">
                <i class="fas fa-lock text-muted"></i>
              </span>
              <input 
                type="password" 
                class="form-control border-start-0" 
                placeholder="Create a password" 
                [(ngModel)]="password"
                name="password"
                required
                style="padding-left: 0;">
            </div>
            <small class="text-muted">Use at least 8 characters with letters and numbers</small>
          </div>
          
          <div class="mb-4" *ngIf="error">
            <div class="alert alert-danger border-0" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
              <i class="fas fa-exclamation-triangle me-2"></i>{{error}}
            </div>
          </div>
          
          <div class="mb-4" *ngIf="success">
            <div class="alert alert-success border-0" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <i class="fas fa-check-circle me-2"></i>{{success}}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100 btn-ripple py-3 fw-semibold" 
            [disabled]="isLoading || !username || !email || !password"
            style="font-size: 1.1rem; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 50px;">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!isLoading" class="fas fa-user-plus me-2"></i>
            {{isLoading ? 'Creating Account...' : 'Create Account'}}
          </button>
        </form>
        
        <form *ngIf="showOtp" (ngSubmit)="verifyOtp()">
          <div class="mb-4">
            <p class="text-center text-muted">We've sent a 6-digit OTP to<br><strong>{{email}}</strong></p>
          </div>
          
          <div class="mb-4">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0">
                <i class="fas fa-key text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control border-start-0" 
                placeholder="Enter 6-digit OTP" 
                [(ngModel)]="otp"
                name="otp"
                maxlength="6"
                required
                style="padding-left: 0;">
            </div>
          </div>
          
          <div class="mb-4" *ngIf="error">
            <div class="alert alert-danger border-0" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
              <i class="fas fa-exclamation-triangle me-2"></i>{{error}}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100 btn-ripple py-3 fw-semibold" 
            [disabled]="isLoading || !otp || otp.length !== 6"
            style="font-size: 1.1rem; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 50px;">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!isLoading" class="fas fa-check-circle me-2"></i>
            {{isLoading ? 'Verifying...' : 'Verify OTP'}}
          </button>
        </form>
        
        <div class="text-center mt-4" *ngIf="!showOtp">
          <a routerLink="/auth/login" class="text-decoration-none fw-semibold" style="color: #667eea;">
            <i class="fas fa-sign-in-alt me-1"></i>Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.glass-card {
  animation: slideInUp 0.8s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-control {
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  otp = '';
  error = '';
  success = '';
  isLoading = false;
  showOtp = false;
  
  constructor(private authService: AuthService, private router: Router) {}
  
  register() {
    this.error = '';
    this.success = '';
    this.isLoading = true;
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.showOtp = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = typeof err.error === 'string' ? err.error : (err.error?.error || err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
  
  verifyOtp() {
    this.error = '';
    this.isLoading = true;
    this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = 'Email verified successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = typeof err.error === 'string' ? err.error : (err.error?.error || 'Invalid OTP. Please try again.');
      }
    });
  }
}
