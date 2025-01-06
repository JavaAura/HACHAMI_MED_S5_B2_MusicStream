import { Track } from "./track.interface";

export interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentIndex: number;
  volume: number;
  progress: number;
}
