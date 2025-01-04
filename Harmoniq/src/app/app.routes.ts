import { Routes } from '@angular/router';
import { TracksComponent } from './pages/tracks/tracks.component';
import { LibrariesComponent } from './pages/libraries/libraries.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'tracks',
    component: TracksComponent
  },
  {
    path: 'libraries',
    component: LibrariesComponent
  }
];
