import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${username}`);
  }

  getUserPosts(username: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/posts/user/${username}`);
  }

  updateProfile(username: string, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${username}`, updates);
  }

  updateCurrentUserProfile(updates: Partial<User>): Observable<User> {
    const userId = localStorage.getItem('userId');
    return this.http.put<User>(`${this.apiUrl}/profile`, updates, {
      headers: { 'X-User-Id': userId || '' }
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  followUser(username: string): Observable<any> {
    const follower = localStorage.getItem('username');
    return this.http.post(`/api/social/follow/${username}?follower=${follower}`, {});
  }

  unfollowUser(username: string): Observable<any> {
    const follower = localStorage.getItem('username');
    return this.http.delete(`/api/social/unfollow/${username}?follower=${follower}`);
  }

  getFollowers(username: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/social/followers/${username}`);
  }

  getFollowing(username: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/social/following/${username}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`/api/search?query=${encodeURIComponent(query)}`);
  }
}
