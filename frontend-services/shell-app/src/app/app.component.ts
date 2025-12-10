import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `<router-outlet></router-outlet>`,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .logo { font-size: 24px; font-weight: 700; cursor: pointer; letter-spacing: 1px; }
    .navbar { position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(10px); }
    .active-link { background: rgba(255, 255, 255, 0.2); border-radius: 8px; }
    .create-btn { background: rgba(74, 144, 226, 0.2) !important; border-radius: 8px; }
    .logout-btn { border-color: #ff4444 !important; color: white !important; }
    .main-content { min-height: calc(100vh - 64px); }
    button mat-icon { margin-right: 4px; }
  `]
})
export class AppComponent {
  notificationCount = 0;
  
  constructor(public authService: AuthService, public router: Router) {}
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
