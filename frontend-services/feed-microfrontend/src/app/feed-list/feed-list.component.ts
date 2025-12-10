import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-feed-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
    <div style="max-width: 800px; margin: 20px auto; padding: 20px;">
      <h2 style="margin-bottom: 20px;">Feed</h2>
      
      <!-- Feed Filter Buttons -->
      <div style="display: flex; justify-content: center; margin-bottom: 20px; gap: 10px;">
        <button mat-raised-button 
                [color]="activeFeedType === 'universal' ? 'primary' : ''"
                (click)="switchFeed('universal')">
          🌍 Universal Feed
        </button>
        <button mat-raised-button 
                [color]="activeFeedType === 'followers' ? 'primary' : ''"
                (click)="switchFeed('followers')">
          👥 Following Feed
        </button>
      </div>
      
      <button mat-raised-button color="accent" routerLink="/feed/create" style="margin-bottom: 20px; width: 100%;">
        <mat-icon>add</mat-icon> Create Post
      </button>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 40px;">
        <mat-icon style="font-size: 48px; animation: spin 1s linear infinite;">refresh</mat-icon>
        <p>Loading...</p>
      </div>
      
      <!-- Post Cards -->
      <mat-card *ngFor="let post of posts" style="margin-bottom: 20px;">
        <mat-card-header>
          <div mat-card-avatar style="background-image: url('https://via.placeholder.com/40'); background-size: cover;"></div>
          <mat-card-title>{{post.username}}</mat-card-title>
          <mat-card-subtitle>{{post.createdAt | date:'short'}}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <p [innerHTML]="formatContent(post.content)"></p>
          
          <!-- Media Display -->
          <div *ngIf="post.imageUrl" style="margin-top: 10px;">
            <video *ngIf="post.mediaType === 'video'" 
                   [src]="post.imageUrl" 
                   controls 
                   style="max-width: 100%; border-radius: 8px;">
            </video>
            <img *ngIf="!post.mediaType || post.mediaType === 'image'" 
                 [src]="post.imageUrl" 
                 style="max-width: 100%; border-radius: 8px;">
          </div>
        </mat-card-content>
        
        <mat-card-actions style="display: flex; gap: 10px;">
          <button mat-button (click)="likePost(post.id)">
            <mat-icon>favorite</mat-icon> {{post.likesCount}} Likes
          </button>
          <button mat-button (click)="toggleComments(post)">
            <mat-icon>comment</mat-icon> {{post.commentsCount}} Comments
          </button>
          <button mat-button (click)="sharePost(post.id)">
            <mat-icon>share</mat-icon> {{post.sharesCount || 0}} Shares
          </button>
        </mat-card-actions>
        
        <!-- Comments Section -->
        <div *ngIf="post.showComments" style="padding: 16px; background: #f5f5f5; border-top: 1px solid #ddd;">
          <div style="margin-bottom: 16px;">
            <textarea matInput 
                      [(ngModel)]="post.newComment" 
                      placeholder="Write a comment..."
                      style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                      rows="2"></textarea>
            <button mat-raised-button color="primary" 
                    (click)="addComment(post)" 
                    style="margin-top: 8px;"
                    [disabled]="!post.newComment?.trim()">
              Post Comment
            </button>
          </div>
          
          <div *ngFor="let comment of post.comments" style="margin-bottom: 12px; padding: 12px; background: white; border-radius: 4px;">
            <strong>{{comment.username}}</strong>
            <small style="color: gray; margin-left: 8px;">{{comment.createdAt | date:'short'}}</small>
            <p style="margin: 8px 0;">{{comment.content}}</p>
          </div>
        </div>
      </mat-card>
      
      <p *ngIf="posts.length === 0 && !isLoading" style="text-align: center; color: gray; padding: 40px;">
        No posts available. Create your first post!
      </p>
      
      <div *ngIf="currentPage < totalPages - 1" style="text-align: center; margin-top: 20px;">
        <button mat-raised-button color="primary" (click)="loadMore()">
          Load More
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class FeedListComponent implements OnInit {
  private postService = inject(PostService);
  posts: any[] = [];
  isLoading = true;
  currentPage = 0;
  totalPages = 0;
  activeFeedType = 'universal';
  
  ngOnInit() {
    this.loadPosts();
  }
  
  loadPosts() {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, 10, this.activeFeedType).subscribe({
      next: (response) => {
        this.posts = response.content.map((post: any) => ({
          ...post,
          showComments: false,
          newComment: '',
          comments: []
        }));
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
      }
    });
  }
  
  switchFeed(feedType: string) {
    this.activeFeedType = feedType;
    this.currentPage = 0;
    this.posts = [];
    this.loadPosts();
  }
  
  formatContent(content: string): string {
    if (!content) return '';
    let formatted = content.replace(/#(\w+)/g, '<span style="color: #1976d2; font-weight: bold;">#$1</span>');
    formatted = formatted.replace(/@(\w+)/g, '<span style="color: #4caf50; font-weight: bold;">@$1</span>');
    return formatted;
  }
  
  likePost(postId: number) {
    this.postService.likePost(postId).subscribe({
      next: () => this.loadPosts(),
      error: (error) => console.error('Error liking post:', error)
    });
  }
  
  sharePost(postId: number) {
    this.postService.sharePost(postId).subscribe({
      next: () => this.loadPosts(),
      error: (error) => console.error('Error sharing post:', error)
    });
  }
  
  toggleComments(post: any) {
    post.showComments = !post.showComments;
    if (post.showComments && post.comments.length === 0) {
      this.loadComments(post);
    }
  }
  
  loadComments(post: any) {
    this.postService.getComments(post.id).subscribe({
      next: (comments) => post.comments = comments,
      error: (error) => console.error('Error loading comments:', error)
    });
  }
  
  addComment(post: any) {
    if (post.newComment?.trim()) {
      this.postService.addComment(post.id, post.newComment).subscribe({
        next: () => {
          post.newComment = '';
          this.loadComments(post);
          this.loadPosts();
        },
        error: (error) => console.error('Error adding comment:', error)
      });
    }
  }
  
  loadMore() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.postService.getPosts(this.currentPage, 10, this.activeFeedType).subscribe({
        next: (response) => {
          const newPosts = response.content.map((post: any) => ({
            ...post,
            showComments: false,
            newComment: '',
            comments: []
          }));
          this.posts = [...this.posts, ...newPosts];
        },
        error: (error) => console.error('Error loading more posts:', error)
      });
    }
  }
}
