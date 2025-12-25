import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: string;
  author: any;
  content: string;
  createdDate: Date;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'http://3.231.75.61:8090/api/feeds';

  constructor(private http: HttpClient) { }

  getFeed(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed?page=${page}&size=${size}`);
  }

  getUserFeed(username: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed/user/${username}?page=${page}&size=${size}`);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`);
  }

  loadMorePosts(followingNames: string[]): any[] {
    return [];
  }
}
