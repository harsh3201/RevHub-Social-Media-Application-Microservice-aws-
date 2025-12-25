import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  isPrivate?: boolean;
  followersCount?: number;
  followingCount?: number;
  followStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://3.231.75.61:8090/api';
  private uploadUrl = 'http://3.231.75.61:8090/api/users/profile-picture';

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`);
  }

  updateProfile(updates: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, updates);
  }

  updateCurrentUserProfile(updates: any): Observable<User> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || '';
    return this.http.put<User>(`${this.apiUrl}/users/profile`, updates, {
      headers: { 'X-User-Id': userId.toString() }
    });
  }

  getUserPosts(username: string): Observable<any[]> {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.get<any[]>(`${this.apiUrl}/posts/user/${username}`, {
      headers: { 'X-Username': currentUser.username || '' }
    });
  }

  followUser(username: string): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.post(`${this.apiUrl}/social/follow/${username}?follower=${currentUser.username}`, {});
  }

  unfollowUser(username: string): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.delete(`${this.apiUrl}/social/unfollow/${username}?follower=${currentUser.username}`);
  }

  getFollowers(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/social/followers/${username}`);
  }

  getFollowing(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/social/following/${username}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?search=${query}`);
  }

  getFollowStatus(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/social/follow-status/${username}`);
  }

  cancelFollowRequest(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/social/follow-request/${username}`);
  }

  removeFollower(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/social/follower/${username}`);
  }
}
