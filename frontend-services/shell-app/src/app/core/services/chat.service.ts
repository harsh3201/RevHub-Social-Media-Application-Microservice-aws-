import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
  id?: string;
  senderUsername: string;
  receiverUsername: string;
  content: string;
  timestamp: Date;
  readStatus?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://3.231.75.61:8090/api/chats';
  private wsUrl = 'http://3.231.75.61:8090/ws';
  private stompClient: Client | null = null;
  private messageSubject = new Subject<ChatMessage>();
  public messages$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.connect();
  }

  private connect() {
    // WebSocket disabled - using HTTP polling instead
    console.log('Chat service initialized with HTTP polling');
  }

  sendMessage(receiverUsername: string, content: string): Observable<ChatMessage> {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}').username;
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, {
      senderUsername: currentUser,
      receiverUsername,
      content
    });
  }

  getConversation(username: string): Observable<ChatMessage[]> {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}').username;
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/conversation?user1=${currentUser}&user2=${username}`);
  }

  getChatContacts(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/contacts?username=${username}`);
  }

  markAsRead(senderUsername: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-read/${senderUsername}`, {});
  }

  getUnreadCount(senderUsername: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/${senderUsername}`);
  }
}
