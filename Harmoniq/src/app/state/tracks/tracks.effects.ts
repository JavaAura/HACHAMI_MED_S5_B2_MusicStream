import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import * as TrackActions from "./tracks.actions"
import { TrackService } from '../../service/track.service';
import { Store } from '@ngrx/store';
import { AlertService } from '../../service/alert.service';
import * as TrackSelectors from './tracks.selectors';
import { AppState } from '../store/app.state';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.loadTracks),
    mergeMap(() => {
      console.log('Loading tracks...'); // Debug log
      return this.trackService.getTracks().pipe(
        map(tracks => {
          console.log('Loaded tracks:', tracks); // Debug log
          return TrackActions.loadTracksSuccess({ tracks });
        }),
        catchError(error => {
          console.error('Error loading tracks:', error); // Debug log
          return of(TrackActions.loadTracksFailure({ error }));
        })
      );
    })
  ));

  createTrack$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.createTrack),
    mergeMap(({ track, audioFile, imageFile }) => {
      this.store.dispatch(TrackActions.uploadTrackStart());
      this.alertService.loading('Uploading track...');

      return this.trackService.createTrack(track, audioFile, imageFile).pipe(
        map(newTrack => {
          this.alertService.success('Track uploaded successfully!');
          return TrackActions.uploadTrackSuccess({ track: newTrack });
        }),
        catchError(error => {
          this.alertService.error(error.message || 'Failed to upload track');
          return of(TrackActions.uploadTrackError({
            error: error.message || 'Failed to upload track'
          }));
        })
      );
    })
  ));

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.updateTrack),
      switchMap(({ track, audioFile, imageFile }) =>
        this.trackService.updateTrack(track, audioFile, imageFile).pipe(
          map(updatedTrack => TrackActions.updateTrackSuccess({ track: updatedTrack })),
          catchError(error => of(TrackActions.updateTrackFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTrack$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.deleteTrack),
    mergeMap(({ id }) => this.trackService.deleteTrack(id).pipe(
      map(() => {
        this.alertService.success('Track deleted successfully');
        return TrackActions.deleteTrackSuccess({ id });
      }),
      catchError(error => {
        this.alertService.error('Failed to delete track');
        return of(TrackActions.deleteTrackFailure({ error }));
      })
    ))
  ));

  togglePlayPause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.togglePlayPause),
      withLatestFrom(this.store.select(TrackSelectors.selectCurrentTrack)),
      map(([action, currentTrack]) => {
        if (currentTrack?.id === action.track.id) {
          // If same track, just toggle play/pause
          return TrackActions.togglePlay();
        } else {
          // If different track, select and play new track
          return TrackActions.selectTrack({ track: action.track });
        }
      })
    )
  );

  loadTrack$ = createEffect(() => this.actions$.pipe(
    ofType(TrackActions.loadTrack),
    mergeMap(({ id }) => this.trackService.getTrackById(id).pipe(
      map(track => TrackActions.loadTrackSuccess({ track })),
      catchError(error => of(TrackActions.loadTrackFailure({ error: error.message })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private trackService: TrackService,
    private store: Store<AppState>,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {}
}
