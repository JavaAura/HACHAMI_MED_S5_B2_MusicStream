import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Track } from '../../models/track.interface';
import { CommonModule } from '@angular/common';
import { BlobToUrlPipe } from '../../pipes/blob-to-url.pipe';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule, BlobToUrlPipe],
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss']
})
export class TrackCardComponent {
  @Input() track!: Track;
  @Output() playTrack = new EventEmitter<Track>();

  onPlay() {
    this.playTrack.emit(this.track);
  }
}
