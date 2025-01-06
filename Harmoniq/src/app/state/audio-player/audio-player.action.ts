import { createAction, props } from '@ngrx/store';
import { Track } from '../../models/track.interface';

export const loadTrack = createAction(
  '[Audio Player] Load Track',
  props<{ track: Track }>()
);

export const play = createAction('[Audio Player] Play');
export const pause = createAction('[Audio Player] Pause');
export const next = createAction('[Audio Player] Next');
export const previous = createAction('[Audio Player] Previous');
export const updateProgress = createAction(
  '[Audio Player] Update Progress',
  props<{ progress: number }>()
);
export const setVolume = createAction(
  '[Audio Player] Set Volume',
  props<{ volume: number }>()
);

export const loadTracksFromIndexDB = createAction(
  '[Audio Player] Load Tracks From IndexDB'
);

export const loadTracksFromIndexDBSuccess = createAction(
  '[Audio Player] Load Tracks From IndexDB Success',
  props<{ tracks: Track[] }>()
);

export const loadTracksFromIndexDBFailure = createAction(
  '[Audio Player] Load Tracks From IndexDB Failure',
  props<{ error: any }>()
);
