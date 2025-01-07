import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

import { TrackCardComponent } from '../../UI/track-card/track-card.component';
import { AudioPlayerComponent } from '../../UI/audio-player/audio-player.component';
import { TrackService } from '../../service/track.service';
import { Track } from '../../models/track.interface';
import { selectAllTracks } from '../../state/tracks/tracks.selectors';
import * as TracksActions from '../../state/tracks/tracks.actions';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  standalone: true,
  imports: [TrackCardComponent, AudioPlayerComponent, CommonModule, ToastModule , ButtonModule],
  styleUrls: ['./tracks.component.scss'],
  providers: [MessageService]
})
export class TracksComponent implements OnInit, OnDestroy {
  tracks$ = this.store.select(selectAllTracks);
  private subscription: Subscription | undefined;

  constructor(
    private store: Store,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Load tracks only if they haven't been loaded yet
    this.store.dispatch(TracksActions.loadTracks());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onPlayTrack(track: Track) {
    console.log('Playing track:', track);
    // Here you can dispatch an action to handle track playback
    // this.store.dispatch(PlayerActions.playTrack({ track }));
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }
}


