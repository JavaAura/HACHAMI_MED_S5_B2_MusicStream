import { Routes } from '@angular/router';
import { TracksComponent } from './pages/tracks/tracks.component';
import { LibrariesComponent } from './pages/libraries/libraries.component';
import { HomeComponent } from './pages/home/home.component';
import { TrackDetailsComponent } from './pages/trackdetails/trackdetails.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule), 
  },

  {
    path: 'tracks',
    component: TracksComponent
  },
  {
    path: 'libraries',
    component: LibrariesComponent
  },
  {
    path:'details/:id',
    component: TrackDetailsComponent

  }
];
