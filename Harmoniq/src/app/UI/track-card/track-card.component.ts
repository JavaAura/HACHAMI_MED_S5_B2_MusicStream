import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { Track } from '../../models/track.interface';
import { PlayerService } from '../../service/player/player.service';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../service/alert/alert.service';
import * as TrackActions from '../../state/tracks/tracks.actions'
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss'],
})
export class TrackCardComponent {
  @Input() track!: Track; // Track object passed as input

  constructor(
    private trackPlayerService:PlayerService,

    
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

  navigateToTrackDetails(id:string){

  }

  onEdit(track: Track): void {

    // const dialogRef = this.dialog.open(TrackFormComponent, {
    //   width: '600px',
    //   height: '90vh',
    //   disableClose: true,
    //   data: { track, isEdit: true }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     const updatedTrack: Track = {
    //       ...track,
    //       songName: result.songName,
    //       singerName: result.singerName,
    //       category: result.category,
    //       description: result.description
    //     };

    //     this.store.dispatch(TrackActions.updateTrack({
    //       track: updatedTrack,
    //       audioFile: result.audioFile,
    //       imageFile: result.imageFile
    //     }));

    //     // Refresh track details after update
    //     this.loadTrackFromRoute();
    //   }
    // });
  }

  // async onDelete(track: Track) {
  //   const confirmed = await this.alertService.confirm(
  //     'Delete Track',
  //     `Are you sure you want to delete "${track.songName}"?`
  //   );

  //   if (confirmed) {
  //     this.store.dispatch(TrackActions.deleteTrack({ id: track.id }));
  //     this.router.navigate(['/library']);
  //   }
  // }
}
