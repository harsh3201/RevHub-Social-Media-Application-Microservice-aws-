import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(this.loadTheme());
  isDarkTheme$ = this.darkTheme.asObservable();

  constructor() {
    this.applyTheme(this.darkTheme.value);
  }

  private loadTheme(): boolean {
    return localStorage.getItem('darkTheme') === 'true';
  }

  toggleTheme() {
    const newTheme = !this.darkTheme.value;
    this.darkTheme.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('darkTheme', String(newTheme));
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
