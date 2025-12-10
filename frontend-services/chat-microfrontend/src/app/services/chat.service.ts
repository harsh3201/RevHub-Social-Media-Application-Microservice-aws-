import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  senderUsername: string;
  receiverUsername: string;
  content: string;
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = '/api/chat';

  constructor(private http: HttpClient) { }

  sendMessage(receiverUsername: string, content: string): Observable<ChatMessage> {
    const senderUsername = localStorage.getItem('username') || 'anonymous';
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, {
      senderUsername,
      receiverUsername,
      content
    });
  }

  getConversation(user1: string, user2: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/conversation?user1=${user1}&user2=${user2}`);
  }

  markAsRead(messageId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read/${messageId}`, {});
  }

  getUserMessages(username: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/${username}`);
  }

  getUnreadMessages(username: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/unread/${username}`);
  }
}
