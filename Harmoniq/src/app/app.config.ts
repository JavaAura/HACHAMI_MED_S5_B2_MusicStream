import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
// import { TracksEffects } from './state/tracks/tracks.effects';
// import { tracksReducer } from './state/tracks/tracks.reducer';
// import { playerReducer } from './state/player/player.reducer';
// import { PlayerEffects } from './state/player/player.effects';

import { TrackEffects } from './state/tracks/tracks.effects';
import { trackReducer } from './state/tracks/tracks.reducer';
import { TrackPlayerService } from './service/track-player.service';
import { IndexedDBService } from './service/indexed-db.service';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      track: trackReducer,

    }),
    provideEffects([TrackEffects]),
    TrackPlayerService,
    IndexedDBService
  ],
};

