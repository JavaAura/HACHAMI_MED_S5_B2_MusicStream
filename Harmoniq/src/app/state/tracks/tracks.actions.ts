import { createAction, props } from '@ngrx/store';
import { Track } from '../../models/track.interface';

// Load Tracks
export const loadTracks = createAction('[Tracks] Load Tracks');
export const loadTracksSuccess = createAction(
  '[Tracks] Load Tracks Success',
  props<{ tracks: Track[] }>()
);
export const loadTracksFailure = createAction(
  '[Tracks] Load Tracks Failure',
  props<{ error: any }>()
);

// Add Track
export const addTrack = createAction(
  '[Tracks] Add Track',
  props<{ track: Track }>()
);
export const addTrackSuccess = createAction(
  '[Tracks] Add Track Success',
  props<{ track: Track }>()
);
export const addTrackFailure = createAction(
  '[Tracks] Add Track Failure',
  props<{ error: any }>()
);

export const updateTrack = createAction('[Tracks] Update Track', props<{ track: Track }>());
export const deleteTrack = createAction('[Tracks] Delete Track', props<{ trackId: string }>());
