import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TracksState } from './tracks.reducer';

// Feature selector
export const selectTracksState = createFeatureSelector<TracksState>('tracks');

// Individual selectors
export const selectAllTracks = createSelector(selectTracksState, state => state.tracks);

export const selectTrackById = (trackId: string) =>
  createSelector(selectAllTracks, tracks => tracks.find(track => track.id === trackId));

export const selectTracksLoading = createSelector(selectTracksState, state => state.loading);
export const selectTracksError = createSelector(selectTracksState, state => state.error);
