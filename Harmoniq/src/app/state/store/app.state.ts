import { Track } from "../../models/track.interface";
import { LoadingState } from '../../models/loading-state.interafce';

export interface AppState {
  tracks: TrackState;
}

export interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  uploadState: LoadingState;
  currentTrack?: Track;
  isPlaying: boolean;
}

export const initialTrackState: TrackState = {
  tracks: [],
  loading: false,
  error: null,
  uploadState: {
    loading: false
  },
  isPlaying: false,
  currentTrack: undefined
};
