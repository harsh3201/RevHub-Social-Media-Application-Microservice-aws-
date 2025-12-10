import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div style="max-width: 800px; margin: 20px auto;">
      <mat-card *ngIf="user">
        <mat-card-header>
          <div style="width: 80px; height: 80px; border-radius: 50%; background: #3f51b5; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; margin-right: 16px;">
            {{user.username?.charAt(0).toUpperCase()}}
          </div>
          <div>
            <mat-card-title>{{user.firstName}} {{user.lastName}}</mat-card-title>
            <mat-card-subtitle>{{ '@' + user.username }}</mat-card-subtitle>
            <div style="display: flex; gap: 20px; margin-top: 8px; font-size: 14px;">
              <span><strong>{{followersCount}}</strong> Followers</span>
              <span><strong>{{followingCount}}</strong> Following</span>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <p><strong>Email:</strong> {{user.email}}</p>
          <p *ngIf="user.bio"><strong>Bio:</strong> {{user.bio}}</p>
          <p><strong>Joined:</strong> {{user.createdAt | date:'mediumDate'}}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="followUser()" *ngIf="!isOwnProfile">
            <mat-icon>person_add</mat-icon> Follow
          </button>
        </mat-card-actions>
      </mat-card>
      
      <h3 style="margin-top: 30px;">Posts</h3>
      <mat-card *ngFor="let post of posts" style="margin-bottom: 20px;">
        <mat-card-content>
          <p>{{post.content}}</p>
          <img *ngIf="post.imageUrl" [src]="post.imageUrl" style="max-width: 100%; border-radius: 8px;">
          <p style="color: gray; font-size: 12px;">{{post.createdAt | date:'short'}}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProfileViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  user: any = null;
  posts: any[] = [];
  isOwnProfile = false;
  followersCount = 0;
  followingCount = 0;
  
  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username') || JSON.parse(localStorage.getItem('user') || '{}').username;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.isOwnProfile = username === currentUser.username;
    
    this.http.get(`/api/users/${username}`).subscribe({
      next: (data) => this.user = data,
      error: (error) => console.error('Error loading user:', error)
    });
    
    this.http.get<any[]>(`/api/posts/user/${username}`).subscribe({
      next: (data) => this.posts = data,
      error: (error) => console.error('Error loading posts:', error)
    });
    
    this.http.get<any[]>(`/api/social/followers/${username}`).subscribe({
      next: (data) => {
        console.log('Followers data:', data);
        this.followersCount = data.length;
      },
      error: (error) => console.error('Error loading followers:', error)
    });
    
    this.http.get<any[]>(`/api/social/following/${username}`).subscribe({
      next: (data) => {
        console.log('Following data:', data);
        this.followingCount = data.length;
      },
      error: (error) => console.error('Error loading following:', error)
    });
  }
  
  followUser() {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.post(`/api/social/follow/${this.user.username}?follower=${currentUser.username}`, {}).subscribe({
      next: () => {
        alert('Followed successfully!');
        this.followersCount++;
      },
      error: (error) => console.error('Error following user:', error)
    });
  }
}
