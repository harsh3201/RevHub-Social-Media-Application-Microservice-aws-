import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule],
  template: `
    <div style="max-width: 800px; margin: 20px auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Chat</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
            <div *ngFor="let msg of messages" [style.text-align]="msg.senderUsername === currentUser ? 'right' : 'left'" style="margin-bottom: 10px;">
              <div [style.background]="msg.senderUsername === currentUser ? '#3f51b5' : '#e0e0e0'" 
                   [style.color]="msg.senderUsername === currentUser ? 'white' : 'black'"
                   style="display: inline-block; padding: 8px 12px; border-radius: 12px; max-width: 70%;">
                <strong>{{msg.senderUsername}}</strong>
                <p style="margin: 5px 0;">{{msg.content}}</p>
                <small style="font-size: 10px;">{{formatTimestamp(msg.timestamp)}}</small>
              </div>
            </div>
          </div>
          
          <form [formGroup]="messageForm" (ngSubmit)="sendMessage()">
            <mat-form-field style="width: calc(100% - 100px);">
              <mat-label>Type a message...</mat-label>
              <input matInput formControlName="content" required>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!messageForm.valid" style="margin-left: 10px;">Send</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ChatWindowComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  messages: any[] = [];
  currentUser = '';
  
  messageForm = this.fb.group({
    content: ['', Validators.required]
  });
  
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUser = user.username;
    this.loadMessages();
  }
  
  loadMessages() {
    // For demo, load conversation with a test user
    this.http.get<any[]>(`http://localhost:8090/api/chat/conversation?user1=${this.currentUser}&user2=testuser`).subscribe({
      next: (data) => this.messages = data,
      error: (error) => console.error('Error loading messages:', error)
    });
  }
  
  sendMessage() {
    if (this.messageForm.valid) {
      const messageData = {
        senderUsername: this.currentUser,
        receiverUsername: 'testuser',
        content: this.messageForm.value.content
      };
      
      this.http.post('http://localhost:8090/api/chat/send', messageData).subscribe({
        next: () => {
          this.messageForm.reset();
          this.loadMessages();
        },
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }
  
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
