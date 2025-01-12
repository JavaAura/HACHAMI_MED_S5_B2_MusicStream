import { createReducer, on } from '@ngrx/store';
import * as TrackActions from './tracks.actions';
import { Track } from '../../models/track.interface';

export interface TrackState {
  tracks: Track[];
  currentTrack: Track | null;
  loading: boolean;
  error: string | null;
  isPlaying: boolean;
}

export const initialState: TrackState = {
  tracks: [],
  currentTrack: null,
  loading: false,
  error: null,
  isPlaying: false
};

export const trackReducer = createReducer(
  initialState,

  // Load Tracks
  on(TrackActions.loadTracks, state => ({
    ...state,
    loading: true
  })),
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => {
    console.log('Reducer: loadTracksSuccess', tracks); // Debug log
    return {
      ...state,
      tracks,
      loading: false
    };
  }),
  on(TrackActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Create Track
  on(TrackActions.createTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
    loading: false
  })),

  // Update Track
  on(TrackActions.updateTrack, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => t.id === track.id ? track : t),
    currentTrack: track,
    loading: false
  })),

  on(TrackActions.updateTrackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Track
  on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(t => t.id !== id),
    loading: false
  })),

  on(TrackActions.uploadTrackStart, (state) => ({
    ...state,
    uploadState: {
      loading: true,
      error: undefined,
      success: undefined
    }
  })),

  on(TrackActions.uploadTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
    uploadState: {
      loading: false,
      success: 'Track uploaded successfully!',
      error: undefined
    }
  })),

  on(TrackActions.uploadTrackError, (state, { error }) => ({
    ...state,
    uploadState: {
      loading: false,
      error,
      success: undefined
    }
  })),

  on(TrackActions.togglePlay, (state) => ({
    ...state,
    isPlaying: !state.isPlaying
  })),

  // Add these cases to handle loading a single track
  on(TrackActions.loadTrack, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TrackActions.loadTrackSuccess, (state, { track }) => ({
    ...state,
    currentTrack: track,
    loading: false
  })),

  on(TrackActions.loadTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Update the selectTrack action handler
  on(TrackActions.selectTrack, (state, { track }) => ({
    ...state,
    currentTrack: track
  }))
);
