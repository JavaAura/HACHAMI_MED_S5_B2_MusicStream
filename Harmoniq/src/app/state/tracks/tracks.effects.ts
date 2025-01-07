import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TrackService } from '../../service/track.service';
import * as TracksActions from './tracks.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class TracksEffects {
  constructor(private actions$: Actions, private tracksService: TrackService) {}

  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.loadTracks),
      tap(() => console.log('Loading tracks effect triggered')),
      mergeMap(() =>
        from(this.tracksService.getAllTracks()).pipe(
          tap(tracks => console.log('Tracks loaded successfully:', tracks)),
          map(tracks => TracksActions.loadTracksSuccess({ tracks })),
          catchError(error => {
            console.error('Error loading tracks:', error);
            return of(TracksActions.loadTracksFailure({ error: error.message }))
          })
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.addTrack),
      mergeMap(action =>
        from(this.tracksService.saveTrack(action.track)).pipe(
          map(savedTrack => TracksActions.addTrackSuccess({ track: savedTrack })),
          catchError(error => of(TracksActions.addTrackFailure({ error })))
        )
      )
    )
  );
}
