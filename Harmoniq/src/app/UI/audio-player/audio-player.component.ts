import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
// import { AudioPlayerService } from '../../service/audioplayer.service';
import { Track } from '../../models/track.interface';
import * as TrackSelectors from "../../state/tracks/tracks.selectors"
import { CommonModule } from '@angular/common';
// import { BlobToUrlPipe } from '../../pipes/safe-url.pipe';
import { PlayerService } from '../../service/player.service';
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AudioPlayerComponent {
  currentTrack: Track | null = null;
  isPlaying = false;
  currentTime = '0:00';
  duration = '0:00';
  progress = 0;
  tracks$ = this.store.select(TrackSelectors.selectAllTracks);
  private trackSubscription!: Subscription;
  private progressSubscription!: Subscription;
  volume = 100;
  private previousVolume = 100;

  constructor(
    private trackPlayerService: PlayerService,
    private store: Store
  ) {}

  ngOnInit() {
    // Subscribe to current track
    this.trackSubscription = this.trackPlayerService.getCurrentTrack()
      .subscribe(track => {
        this.currentTrack = track;
        this.isPlaying = !!track;
      });

    // Subscribe to progress updates
    this.progressSubscription = this.trackPlayerService.getProgress()
      .subscribe(({ currentTime, duration, progress }) => {
        this.currentTime = currentTime;
        this.duration = duration;
        this.progress = progress;
      });
  }

  togglePlay() {
    if (this.currentTrack) {
      if (this.isPlaying) {
        this.trackPlayerService.pauseTrack();
      } else {
        this.trackPlayerService.resumeTrack();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  playNextTrack() {
    this.trackPlayerService.playNextTrack();
  }

  playPreviousTrack() {
    this.trackPlayerService.playPreviousTrack();
  }

  seekTo(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.trackPlayerService.seekTo(Number(value));
  }

  setVolume(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.volume = value;
    this.trackPlayerService.setVolume(value);
  }

  toggleMute(): void {
    if (this.volume > 0) {
      this.previousVolume = this.volume;
      this.volume = 0;
    } else {
      this.volume = this.previousVolume;
    }
    this.trackPlayerService.setVolume(this.volume);
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }
}
