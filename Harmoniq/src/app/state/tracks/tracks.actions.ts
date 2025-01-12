import { createAction, props } from '@ngrx/store';
import { Track } from '../../models/track.interface';

// Load Tracks
export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction(
  '[Track] Load Tracks Success',
  props<{ tracks: any[] }>()
);
export const loadTracksFailure = createAction(
  '[Track] Load Tracks Failure',
  props<{ error: any }>()
);

// Create Track
export const createTrack = createAction(
  '[Track] Create Track',
  props<{ track: Track; audioFile: File; imageFile?: File }>()
);
export const createTrackSuccess = createAction(
  '[Track] Create Track Success',
  props<{ track: any }>()
);
export const createTrackFailure = createAction(
  '[Track] Create Track Failure',
  props<{ error: any }>()
);

// Update Track
export const updateTrack = createAction(
  '[Track] Update Track',
  props<{ track: Track; audioFile?: File; imageFile?: File }>()
);
export const updateTrackSuccess = createAction(
  '[Track] Update Track Success',
  props<{ track: Track }>()
);
export const updateTrackFailure = createAction(
  '[Track] Update Track Failure',
  props<{ error: string }>()
);

// Delete Track
export const deleteTrack = createAction(
  '[Track] Delete Track',
  props<{ id: string }>()
);
export const deleteTrackSuccess = createAction(
  '[Track] Delete Track Success',
  props<{ id: string }>()
);
export const deleteTrackFailure = createAction(
  '[Track] Delete Track Failure',
  props<{ error: any }>()
);

// Upload Track
export const uploadTrackStart = createAction(
  '[Track] Upload Track Start'
);

export const uploadTrackSuccess = createAction(
  '[Track] Upload Track Success',
  props<{ track: Track }>()
);

export const uploadTrackError = createAction(
  '[Track] Upload Track Error',
  props<{ error: string }>()
);

export const selectTrack = createAction(
  '[Track] Select Track',
  props<{ track: any }>()
);

// Add this new action
export const togglePlayPause = createAction(
  '[Track] Toggle Play Pause',
  props<{ track: Track }>()
);

export const togglePlay = createAction(
  '[Track] Toggle Play'
);

// Add these new actions after the loadTracks actions
export const loadTrack = createAction(
  '[Track] Load Track',
  props<{ id: string }>()
);

export const loadTrackSuccess = createAction(
  '[Track] Load Track Success',
  props<{ track: Track }>()
);

export const loadTrackFailure = createAction(
  '[Track] Load Track Failure',
  props<{ error: string }>()
);
