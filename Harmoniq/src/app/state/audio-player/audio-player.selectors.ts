import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioPlayerState } from '../../models/audio-player.interface';

export const selectAudioPlayerState = createFeatureSelector<AudioPlayerState>('audioPlayer');

export const selectCurrentTrack = createSelector(
  selectAudioPlayerState,
  (state) => state.currentTrack
);

export const selectIsPlaying = createSelector(
  selectAudioPlayerState,
  (state) => state.isPlaying
);

export const selectQueue = createSelector(
  selectAudioPlayerState,
  (state) => state.queue
);

export const selectProgress = createSelector(
  selectAudioPlayerState,
  (state) => state.progress
);

export const selectVolume = createSelector(
  selectAudioPlayerState,
  (state) => state.volume
);

export const selectCanPlayNext = createSelector(
  selectAudioPlayerState,
  (state) => state.currentIndex < state.queue.length - 1
);

export const selectCanPlayPrevious = createSelector(
  selectAudioPlayerState,
  (state) => state.currentIndex > 0
);
