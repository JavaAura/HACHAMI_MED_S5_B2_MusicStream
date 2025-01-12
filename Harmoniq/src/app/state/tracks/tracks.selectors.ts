import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState } from './tracks.reducer';

export const selectTrackState = createFeatureSelector<TrackState>('track');

export const selectAllTracks = createSelector(
  selectTrackState,
  state => state.tracks
);

export const selectCurrentTrack = createSelector(
  selectTrackState,
  state => state.currentTrack
);

export const selectIsLoading = createSelector(
  selectTrackState,
  state => state.loading
);

export const selectError = createSelector(
  selectTrackState,
  state => state.error
);

export const selectIsPlaying = createSelector(
  selectTrackState,
  state => state.isPlaying
);

export const selectTrackById = (trackId: string | null) => createSelector(
  selectAllTracks,
  (tracks) => tracks.find(track => track.id === trackId)
);
