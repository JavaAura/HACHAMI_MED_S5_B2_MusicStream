import { createAction, props } from '@ngrx/store';
import { Track } from '../../models/track.interface';



export const setCurrentTrack = createAction(
  '[Audio Player] Set Current Track',
  props<{ track: Track }>()
);

export const setQueue = createAction(
  '[Audio Player] Set Queue',
  props<{ tracks: Track[] }>()
);

// Playback State
export const updateProgress = createAction(
  '[Audio Player] Update Progress',
  props<{ progress: number }>()
);

export const setVolume = createAction(
  '[Audio Player] Set Volume',
  props<{ volume: number }>()
);
