import { Routes } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';

export const routes: Routes = [
  { path: '', component: ProfileViewComponent },
  { path: ':username', component: ProfileViewComponent }
];
