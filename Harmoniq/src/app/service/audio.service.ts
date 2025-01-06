import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Track } from '../models/track.interface';
import * as AudioPlayerActions from '../state/audio-player/audio-player.action';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext;
  private audioElement: HTMLAudioElement;
  private track: Track | null = null;

  constructor(private store: Store) {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio();

    // Mettre à jour la progression
    this.audioElement.addEventListener('timeupdate', () => {
      const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
      this.store.dispatch(AudioPlayerActions.updateProgress({ progress }));
    });

    // Gérer la fin de la piste
    this.audioElement.addEventListener('ended', () => {
      this.store.dispatch(AudioPlayerActions.next());
    });
  }

  loadTrack(track: Track) {
    this.track = track;
    this.audioElement.src = track.audioUrl;
    this.audioElement.load();
    this.store.dispatch(AudioPlayerActions.loadTrack({ track }));
  }

  play() {
    this.audioElement.play();
    this.store.dispatch(AudioPlayerActions.play());
  }

  pause() {
    this.audioElement.pause();
    this.store.dispatch(AudioPlayerActions.pause());
  }

  seek(time: number) {
    this.audioElement.currentTime = time;
  }

  setVolume(volume: number) {
    this.audioElement.volume = volume;
    this.store.dispatch(AudioPlayerActions.setVolume({ volume }));
  }
}
