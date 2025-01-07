import { createReducer, on } from '@ngrx/store';
import { Track } from '../../models/track.interface';
import * as TracksActions from './tracks.actions';

export interface TracksState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

export const initialState: TracksState = {
  tracks: [],
  loading: false,
  error: null,
};

export const tracksReducer = createReducer(
  initialState,
  on(TracksActions.loadTracks, state => ({ ...state, loading: true })),
  on(TracksActions.loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    loading: false,
    tracks,
  })),
  on(TracksActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TracksActions.addTrack, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
  })),
  on(TracksActions.updateTrack, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => (t.id === track.id ? track : t)),
  })),
  on(TracksActions.deleteTrack, (state, { trackId }) => ({
    ...state,
    tracks: state.tracks.filter(t => t.id !== trackId),
  }))
);
