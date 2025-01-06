import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTrack, play } from '../../state/audio-player/audio-player.action';
import { Track } from '../../models/track.interface';
import { TrackCardComponent } from '../../UI/track-card/track-card.component';
import { AudioPlayerComponent } from '../../UI/audio-player/audio-player.component';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  standalone: true,
  imports: [TrackCardComponent,AudioPlayerComponent],
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent {
  constructor(private store: Store) {}

  onPlayTrack(track: Track) {
    this.store.dispatch(loadTrack({ track }));
    this.store.dispatch(play());
  }
}


