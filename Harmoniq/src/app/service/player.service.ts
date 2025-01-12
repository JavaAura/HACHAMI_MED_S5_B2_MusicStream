import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../models/track.interface';
import { IndexedDBService } from './indexed-db.service';
import * as TrackActions from '../state/tracks/tracks.actions';
import { Store } from '@ngrx/store';

interface Progress {
  currentTime: string;
  duration: string;
  progress: number;
}
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private progressSubject = new BehaviorSubject<Progress>({
    currentTime: '0:00',
    duration: '0:00',
    progress: 0
  });
  private isPlayingSubject = new BehaviorSubject<boolean>(false);

  currentTrack$ = this.currentTrackSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  private audio = new Audio();
  private tracks: Track[] = [];
  private currentIndex = -1;
  private previousVolume = 100;

  constructor(
    private store: Store,
    private indexedDbService: IndexedDBService
  ) {
    this.loadTracks();
    this.setupAudioListeners();
  }

  private async loadTracks() {
    try {
      const result = await this.indexedDbService.getAllFiles('audioFiles');
      this.tracks = result;
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  private setupAudioListeners() {
    this.audio.ontimeupdate = () => {
      if (this.audio.duration) {
        const currentTime = this.formatTime(this.audio.currentTime);
        const duration = this.formatTime(this.audio.duration);
        const progress = (this.audio.currentTime / this.audio.duration) * 100;

        this.progressSubject.next({
          currentTime,
          duration,
          progress
        });
      }
    };

    this.audio.onended = () => {
      this.playNextTrack();
    };
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async playTrack(track: Track) {
    console.log("playing track", track);

    try {
      const audioData = await this.indexedDbService.getAudioFile(track.id);
      if (audioData) {
        if (this.audio.src) {
          URL.revokeObjectURL(this.audio.src);
        }

        const blob = new Blob([audioData.data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        this.audio.src = url;
        this.audio.load();
        await this.audio.play();

        this.currentTrackSubject.next(track);
        this.currentIndex = this.tracks.findIndex(t => t.id === track.id);
        this.store.dispatch(TrackActions.selectTrack({ track }));
        this.isPlayingSubject.next(true);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  getProgress(): Observable<Progress> {
    return this.progressSubject.asObservable();
  }

  playNextTrack() {
    if (this.tracks.length === 0) return;
    const nextIndex = (this.currentIndex + 1) % this.tracks.length;
    this.playTrack(this.tracks[nextIndex]);
  }

  playPreviousTrack() {
    if (this.tracks.length === 0) return;
    const prevIndex = this.currentIndex === 0 ? this.tracks.length - 1 : this.currentIndex - 1;
    this.playTrack(this.tracks[prevIndex]);
  }

  seekTo(progress: number) {
    if (this.audio.duration) {
      this.audio.currentTime = (progress / 100) * this.audio.duration;
    }
  }

  pauseTrack() {
    this.audio.pause();
    this.isPlayingSubject.next(false);
  }

  resumeTrack() {
    this.audio.play();
    this.isPlayingSubject.next(true);
  }

  stopTrack() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTrackSubject.next(null);
    this.isPlayingSubject.next(false);
  }

  getCurrentTrack(): Observable<Track | null> {
    return this.currentTrack$;
  }

  setVolume(value: number): void {
    if (this.audio) {
      this.audio.volume = value / 100;
    }
  }

  toggleMute(): void {
    if (this.audio) {
      if (this.audio.volume > 0) {
        this.previousVolume = this.audio.volume * 100;
        this.audio.volume = 0;
      } else {
        this.audio.volume = this.previousVolume / 100;
      }
    }
  }
}
