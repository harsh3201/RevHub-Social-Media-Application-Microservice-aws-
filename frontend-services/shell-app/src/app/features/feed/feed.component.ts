import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height: 100vh; background: #f5f5f5;">
      <nav style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 15px 30px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="margin: 0;"><i class="fas fa-rocket"></i> RevHub</h2>
        <div>
          <span style="margin-right: 20px;">Welcome, {{username}}!</span>
          <button (click)="logout()" style="background: rgba(255,255,255,0.2); border: 1px solid white; color: white; padding: 8px 20px; border-radius: 20px; cursor: pointer;">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      <div style="max-width: 800px; margin: 30px auto; padding: 0 20px;">
        <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;"><i class="fas fa-edit"></i> Create Post</h3>
          <textarea 
            [(ngModel)]="newPostContent" 
            placeholder="What's on your mind?"
            style="width: 100%; min-height: 100px; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; resize: vertical;"
          ></textarea>
          <button 
            (click)="createPost()" 
            [disabled]="!newPostContent.trim()"
            style="margin-top: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; font-weight: 600; cursor: pointer;"
            [style.opacity]="newPostContent.trim() ? '1' : '0.5'"
            [style.cursor]="newPostContent.trim() ? 'pointer' : 'not-allowed'">
            <i class="fas fa-paper-plane"></i> Post
          </button>
        </div>

        <h3 style="color: #333; margin-bottom: 20px;"><i class="fas fa-stream"></i> Feed</h3>
        
        <div *ngIf="loading" style="text-align: center; padding: 40px;">
          <i class="fas fa-spinner fa-spin fa-3x" style="color: #667eea;"></i>
          <p style="margin-top: 15px; color: #666;">Loading posts...</p>
        </div>

        <div *ngIf="!loading && posts.length === 0" style="background: white; border-radius: 15px; padding: 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <i class="fas fa-inbox fa-3x" style="color: #ccc; margin-bottom: 15px;"></i>
          <p style="color: #666; font-size: 18px;">No posts yet. Be the first to post!</p>
        </div>

        <div *ngFor="let post of posts" style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold; margin-right: 15px;">
              {{post.author?.username?.charAt(0)?.toUpperCase() || 'U'}}
            </div>
            <div>
              <h4 style="margin: 0; color: #333;">{{post.author?.username || 'Anonymous'}}</h4>
              <small style="color: #999;">{{formatDate(post.createdDate)}}</small>
            </div>
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 15px 0;">{{post.content}}</p>
          <div style="display: flex; gap: 20px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
            <span style="color: #667eea; cursor: pointer;"><i class="fas fa-heart"></i> {{post.likesCount || 0}}</span>
            <span style="color: #667eea; cursor: pointer;"><i class="fas fa-comment"></i> {{post.commentsCount || 0}}</span>
            <span style="color: #667eea; cursor: pointer;"><i class="fas fa-share"></i> {{post.sharesCount || 0}}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeedComponent implements OnInit {
  username = '';
  newPostContent = '';
  posts: any[] = [];
  loading = false;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || 'User';
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.postService.getPosts(0, 20).subscribe({
      next: (response) => {
        this.posts = response.content || [];
        this.loading = false;
      },
      error: () => {
        this.posts = [];
        this.loading = false;
      }
    });
  }

  createPost() {
    if (this.newPostContent.trim()) {
      const post = {
        username: this.username,
        content: this.newPostContent,
        imageUrl: '',
        visibility: 'PUBLIC'
      };
      
      this.postService.createPost(post).subscribe({
        next: () => {
          this.newPostContent = '';
          this.loadPosts();
        },
        error: () => {}
      });
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}
