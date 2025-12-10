import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <div style="max-width: 600px; margin: 20px auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Post</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
            <mat-form-field style="width: 100%;">
              <mat-label>What's on your mind?</mat-label>
              <textarea matInput formControlName="content" rows="5" required></textarea>
            </mat-form-field>
            <mat-form-field style="width: 100%;">
              <mat-label>Image URL (optional)</mat-label>
              <input matInput formControlName="imageUrl">
            </mat-form-field>
            <mat-form-field style="width: 100%;">
              <mat-label>Visibility</mat-label>
              <select matNativeControl formControlName="visibility">
                <option value="PUBLIC">Public</option>
                <option value="FOLLOWERS_ONLY">Followers Only</option>
              </select>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!postForm.valid">Post</button>
            <button mat-button type="button" (click)="cancel()" style="margin-left: 10px;">Cancel</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  
  postForm = this.fb.group({
    content: ['', Validators.required],
    imageUrl: [''],
    visibility: ['PUBLIC']
  });
  
  onSubmit() {
    if (this.postForm.valid) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const postData = { ...this.postForm.value, username: user.username };
      
      console.log('Creating post:', postData);
      
      this.http.post('/api/posts', postData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.router.navigate(['/feed']);
        },
        error: (error) => {
          console.error('Error creating post:', error);
          const message = error.error?.message || error.message || 'Unknown error';
          alert('Error creating post: ' + message);
        }
      });
    }
  }
  
  cancel() {
    this.router.navigate(['/feed']);
  }
}
