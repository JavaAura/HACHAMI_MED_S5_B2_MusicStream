import { Component, Input } from '@angular/core';
import { Track } from '../../models/track.interface';
import { AudioService } from '../../service/audio.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadTrack, play } from '../../state/audio-player/audio-player.action';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-card.component.html'
})
export class TrackCardComponent {
  @Input() track!: Track;

  constructor(private store: Store) {}

  onPlayClick() {
    this.store.dispatch(loadTrack({ track: this.track }));
    this.store.dispatch(play());
  }
}
