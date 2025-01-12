import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { Track } from '../../models/track.interface';
import { TrackPlayerService } from '../../service/track-player.service';
import { PlayerService } from '../../service/player.service';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss'],
})
export class TrackCardComponent {
  @Input() track!: Track; // Track object passed as input

  constructor(
    private trackPlayerService:PlayerService
  ) {
    console.log('TrackPlayerService:', this.trackPlayerService);
  }

  ngOnInit() {
    console.log('TrackCardComponent initialized with track:', this.track);
  }

  /**
   * Play the current track.
   */
  playTrack(): void {
    if (this.track && this.track.id) {
      console.log('Playing track:', this.track);
      this.trackPlayerService.playTrack(this.track);
    } else {
      console.error('Track ID is missing or invalid');
    }
  }
}
