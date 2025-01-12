import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { TrackEffects } from './state/tracks/tracks.effects';
import { trackReducer } from './state/tracks/tracks.reducer';
import { IndexedDBService } from './service/indexed-db.service';
import { PlayerService } from './service/player.service';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      track: trackReducer,

    }),
    provideEffects([TrackEffects]),
    PlayerService,
    IndexedDBService
  ],
};

