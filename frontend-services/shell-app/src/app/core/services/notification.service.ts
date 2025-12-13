import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: string;
  message: string;
  fromUsername?: string;
  readStatus: boolean;
  createdAt: Date;
  followRequestId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8090/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username;
    if (!username) {
      console.error('No username found in localStorage');
      return new Observable(observer => observer.next([]));
    }
    return this.http.get<Notification[]>(`${this.apiUrl}/${username}`);
  }

  getUnreadCount(): Observable<number> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username;
    if (!username) {
      return new Observable(observer => observer.next(0));
    }
    return this.http.get<number>(`${this.apiUrl}/${username}/unread-count`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`);
  }

  acceptFollowRequest(followRequestId: string): Observable<any> {
    return this.http.post(`http://localhost:8090/api/social/follow-request/${followRequestId}/accept`, {});
  }

  rejectFollowRequest(followRequestId: string): Observable<any> {
    return this.http.post(`http://localhost:8090/api/social/follow-request/${followRequestId}/reject`, {});
  }
}
