import { Routes } from '@angular/router';
import { FeedListComponent } from './feed-list/feed-list.component';
import { CreatePostComponent } from './create-post/create-post.component';

export const routes: Routes = [
  { path: '', component: FeedListComponent },
  { path: 'create', component: CreatePostComponent }
];
