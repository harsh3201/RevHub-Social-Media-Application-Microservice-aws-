import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatBadgeModule],
  template: `
    <div style="max-width: 800px; margin: 20px auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Notifications
            <span *ngIf="unreadCount > 0" style="background: red; color: white; border-radius: 50%; padding: 2px 8px; font-size: 12px; margin-left: 10px;">
              {{unreadCount}}
            </span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let notification of notifications" 
                           [style.background]="notification.read ? 'white' : '#e3f2fd'"
                           style="border-bottom: 1px solid #ddd; padding: 10px;">
              <mat-icon matListItemIcon [color]="getIconColor(notification.type)">
                {{getIcon(notification.type)}}
              </mat-icon>
              <div matListItemTitle>{{notification.message}}</div>
              <div matListItemLine style="font-size: 12px; color: gray;">
                {{notification.createdAt | date:'short'}}
              </div>
              <button mat-icon-button *ngIf="!notification.read" (click)="markAsRead(notification.id)">
                <mat-icon>check</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
          
          <p *ngIf="notifications.length === 0" style="text-align: center; color: gray; padding: 20px;">
            No notifications yet
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class NotificationListComponent implements OnInit {
  private http = inject(HttpClient);
  notifications: any[] = [];
  unreadCount = 0;
  
  ngOnInit() {
    this.loadNotifications();
  }
  
  loadNotifications() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User from localStorage:', user);
    const userId = user.username || user.id;
    console.log('Using userId:', userId);
    if (!userId) {
      console.error('No user found in localStorage');
      return;
    }
    const url = `http://localhost:8080/api/notifications/${userId}`;
    console.log('Fetching notifications from:', url);
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        console.log('Notifications received:', data);
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.read).length;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        console.error('Error details:', error.error);
      }
    });
  }
  
  markAsRead(notificationId: string) {
    this.http.put(`http://localhost:8080/api/notifications/${notificationId}/read`, {}).subscribe({
      next: () => this.loadNotifications(),
      error: (error) => console.error('Error marking as read:', error)
    });
  }
  
  getIcon(type: string): string {
    switch(type) {
      case 'LIKE': return 'favorite';
      case 'COMMENT': return 'comment';
      case 'FOLLOW': return 'person_add';
      case 'MENTION': return 'alternate_email';
      default: return 'notifications';
    }
  }
  
  getIconColor(type: string): string {
    switch(type) {
      case 'LIKE': return 'warn';
      case 'COMMENT': return 'primary';
      case 'FOLLOW': return 'accent';
      default: return 'primary';
    }
  }
}
