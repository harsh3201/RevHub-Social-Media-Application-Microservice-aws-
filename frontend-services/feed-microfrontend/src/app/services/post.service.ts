import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  mediaType?: string;
  visibility?: string;
  username: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface PostRequest {
  content: string;
  imageUrl?: string;
  mediaType?: string;
  visibility?: string;
  username?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  replies?: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = '/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(page: number = 0, size: number = 10, feedType: string = 'universal'): Observable<PageResponse<Post>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('feedType', feedType);
    
    const userStr = localStorage.getItem('user');
    const username = userStr ? JSON.parse(userStr).username : null;
    
    if (username) {
      return this.http.get<PageResponse<Post>>(this.apiUrl, { 
        params, 
        headers: { 'X-Username': username } 
      });
    }
    
    return this.http.get<PageResponse<Post>>(this.apiUrl, { params });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(postData: PostRequest): Observable<any> {
    const userStr = localStorage.getItem('user');
    const username = userStr ? JSON.parse(userStr).username : 'anonymous';
    return this.http.post(this.apiUrl, { ...postData, username }, { 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updatePost(id: number, postData: PostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData);
  }

  deletePost(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  likePost(id: number): Observable<any> {
    const userStr = localStorage.getItem('user');
    const username = userStr ? JSON.parse(userStr).username : null;
    if (username) {
      return this.http.post(`${this.apiUrl}/${id}/like`, {}, {
        headers: { 'X-Username': username }
      });
    }
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  sharePost(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/share`, {});
  }

  addComment(postId: number, content: string): Observable<any> {
    const userStr = localStorage.getItem('user');
    const username = userStr ? JSON.parse(userStr).username : 'anonymous';
    return this.http.post(`${this.apiUrl}/${postId}/comments`, { content }, {
      headers: { 'X-Username': username }
    });
  }

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${postId}/comments`);
  }

  deleteComment(postId: number, commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}/comments/${commentId}`);
  }

  searchPosts(query: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }
}
