import { createReducer, on } from '@ngrx/store';
import { AudioPlayerState } from '../../models/audio-player.interface';
import * as AudioPlayerActions from './audio-player.action';



export const initialState: AudioPlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 1,
  progress: 0,
};

export const audioPlayerReducer = createReducer(
  initialState,
  on(AudioPlayerActions.play, (state) => ({
    ...state,
    isPlaying: true,
  })),

  on(AudioPlayerActions.pause, (state) => ({
    ...state,
    isPlaying: false,
  })),

  on(AudioPlayerActions.next, (state) => ({
    ...state,
    currentIndex: Math.min(state.currentIndex + 1, state.queue.length - 1),
    currentTrack: state.queue[Math.min(state.currentIndex + 1, state.queue.length - 1)] || null,
  })),

  on(AudioPlayerActions.previous, (state) => ({
    ...state,
    currentIndex: Math.max(state.currentIndex - 1, 0),
    currentTrack: state.queue[Math.max(state.currentIndex - 1, 0)] || null,
  })),

  on(AudioPlayerActions.setCurrentTrack, (state, { track }) => ({
    ...state,
    currentTrack: track,
  })),

  on(AudioPlayerActions.setQueue, (state, { tracks }) => ({
    ...state,
    queue: tracks,
    currentIndex: 0,
    currentTrack: tracks[0] || null,
  })),

  on(AudioPlayerActions.updateProgress, (state, { progress }) => ({
    ...state,
    progress,
  })),

  on(AudioPlayerActions.setVolume, (state, { volume }) => ({
    ...state,
    volume,
  }))
);
