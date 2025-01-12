import { Track } from "./track.interface";

export interface PlayerState {
  currentTrackId: string | null;
  track: Track | null; // Add track here
  status: 'stopped' | 'playing' | 'paused' | 'buffering';
  progress: number;
  volume: number;
  loadingState: 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

export const initialPlayerState: PlayerState = {
  currentTrackId: null,
  track: null,
  status: 'stopped',
  progress: 0,
  volume: 50,
  loadingState: 'success',
  errorMessage: null,
};
