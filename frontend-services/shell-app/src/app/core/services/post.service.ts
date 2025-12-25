import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://3.231.75.61:8090/api/posts';
  private socialUrl = 'http://3.231.75.61:8090/api/social';

  constructor(private http: HttpClient) { }

  getPosts(page: number = 0, size: number = 10, feedType: string = 'universal'): Observable<any> {
    const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}&feedType=${feedType}`, {
      headers: { 'X-Username': username }
    });
  }

  createPost(post: any): Observable<any> {
    const username = localStorage.getItem('username') || localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    return this.http.post(this.apiUrl, post, {
      headers: { 'X-Username': username }
    });
  }

  createPostWithFile(formData: FormData): Observable<any> {
    const username = localStorage.getItem('username') || localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    const headers: any = { 'X-Username': username };
    return this.http.post(this.apiUrl, formData, { headers });
  }

  updatePost(postId: string, updates: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, updates);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }

  toggleLike(postId: string, postAuthor?: string): Observable<any> {
    const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    let url = `${this.socialUrl}/toggle-like/${postId}?username=${username}`;
    if (postAuthor) {
      url += `&postAuthor=${postAuthor}`;
    }
    return this.http.post(url, {});
  }

  getComments(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`);
  }

  addComment(postId: string, content: string): Observable<any> {
    const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    return this.http.post(`${this.apiUrl}/${postId}/comments`, { content }, {
      headers: { 'X-Username': username }
    });
  }

  deleteComment(postId: string, commentId: number): Observable<any> {
    const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    return this.http.delete(`${this.apiUrl}/${postId}/comments/${commentId}`, {
      headers: { 'X-Username': username }
    });
  }

  addReply(commentId: number, content: string): Observable<any> {
    const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : '';
    return this.http.post(`${this.apiUrl}/comments/${commentId}/replies`, { content }, {
      headers: { 'X-Username': username }
    });
  }

  sharePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/share`, {});
  }

  searchPosts(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
