import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  media?: string;
  mediaType?: 'image' | 'video';
  visibility: 'public' | 'followers';
  commentsList: any[];
  isPopular?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private globalFeed = new BehaviorSubject<Post[]>([]);
  private userFeed = new BehaviorSubject<Post[]>([]);
  private feedCache = new Map<string, Post[]>();
  private currentPage = 0;
  private pageSize = 10;

  getGlobalFeed(): Observable<Post[]> {
    return this.globalFeed.asObservable();
  }

  getUserFeed(): Observable<Post[]> {
    return this.userFeed.asObservable();
  }

  getFollowingFeed(followingUsers: string[], page: number = 0): Post[] {
    const cacheKey = `following_${page}`;
    if (this.feedCache.has(cacheKey)) {
      return this.feedCache.get(cacheKey)!;
    }

    const allPosts = this.globalFeed.value;
    const followingPosts = allPosts.filter(post => followingUsers.includes(post.author));
    const popularPosts = allPosts.filter(post => post.isPopular && post.likes > 10);
    
    const combinedFeed = [...followingPosts, ...popularPosts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const startIndex = page * this.pageSize;
    const paginatedPosts = combinedFeed.slice(startIndex, startIndex + this.pageSize);
    
    this.feedCache.set(cacheKey, paginatedPosts);
    return paginatedPosts;
  }

  loadMorePosts(followingUsers: string[]): Post[] {
    this.currentPage++;
    return this.getFollowingFeed(followingUsers, this.currentPage);
  }

  resetPagination() {
    this.currentPage = 0;
    this.feedCache.clear();
  }

  deletePost(postId: string): void {
    const currentGlobal = this.globalFeed.value.filter(p => p.id !== postId);
    const currentUser = this.userFeed.value.filter(p => p.id !== postId);
    
    this.globalFeed.next(currentGlobal);
    this.userFeed.next(currentUser);
    this.feedCache.clear();
  }

  updatePost(updatedPost: Post): void {
    const currentGlobal = this.globalFeed.value.map(p => p.id === updatedPost.id ? updatedPost : p);
    const currentUser = this.userFeed.value.map(p => p.id === updatedPost.id ? updatedPost : p);
    
    this.globalFeed.next(currentGlobal);
    this.userFeed.next(currentUser);
    this.feedCache.clear();
  }

  addPost(post: Post): void {
    const currentGlobal = this.globalFeed.value;
    const currentUser = this.userFeed.value;
    
    this.globalFeed.next([post, ...currentGlobal]);
    this.userFeed.next([post, ...currentUser]);
  }
}
