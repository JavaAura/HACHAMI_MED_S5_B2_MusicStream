import { Routes } from '@angular/router';
import { TracksComponent } from './pages/tracks/tracks.component';
import { LibrariesComponent } from './pages/libraries/libraries.component';

export const routes: Routes = [

  
  {
    path: 'tracks',
    component: TracksComponent
  },
  {
    path: 'libraries',
    component: LibrariesComponent
  }
];
