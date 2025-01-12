import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, Inject } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track } from '../../models/track.interface';
import * as TrackActions from '../../state/tracks/tracks.actions';
import * as TrackSelectors from '../../state/tracks/tracks.selectors';
import { AlertService } from '../../service/alert.service';
import { AppState } from '../../state/store/app.state';
import { Router } from '@angular/router';
// import { SearchService } from '../../shared/services/search.service';
import { TrackCardComponent } from '../../UI/track-card/track-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  standalone: true,
  imports: [TrackCardComponent,CommonModule ,RouterModule],
  styleUrls: ['./tracks.component.scss'],
  // providers:[TrackPlayerService]

})
export class TracksComponent implements OnInit, OnDestroy {
  selectedTrack: Track | null = null;
  tracks$ = this.store.select(TrackSelectors.selectAllTracks);
  loading$ = this.store.select(TrackSelectors.selectTrackState);
  currentlyPlaying$ = this.store.select(TrackSelectors.selectCurrentTrack);
  private tracks: Track[] = [];
  allTracks: Track[] = []; // Store all tracks
  // filteredTracks: Track[] = []; // Store filtered tracks
  groupedTracks: Map<string, Track[]> = new Map();

  constructor(
    private store: Store<AppState>,
    private alertService: AlertService,
    // private trackPlayerService: TrackPlayerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tracks$.subscribe(tracks => {
      // Store tracks to clean up URLs later
      this.tracks = tracks;
      this.allTracks = tracks;
      this.groupTracksByCategory(tracks);

      // this.filteredTracks = this.allTracks;
    });

    // console.log("track",this.tracks);

    this.store.dispatch(TrackActions.loadTracks());

    // Subscribe to search terms
    // this.searchService.currentSearchTerm$.subscribe(searchTerm => {
    //   this.filterTracks(searchTerm);
    // });
  }

  ngOnDestroy(): void {
    // Clean up object URLs
    this.tracks.forEach(track => {
      if (track.imageUrl) {
        URL.revokeObjectURL(track.imageUrl);
      }
    });
  }

  // private filterTracks(searchTerm: string) {
  //   if (!searchTerm.trim()) {
  //     this.filteredTracks = this.allTracks;
  //     return;
  //   }

  //   searchTerm = searchTerm.toLowerCase();
  //   this.filteredTracks = this.allTracks.filter(track =>
  //     track.songName.toLowerCase().includes(searchTerm) ||
  //     track.singerName.toLowerCase().includes(searchTerm)
  //   );
  // }

  private groupTracksByCategory(tracks: Track[]): void {
    this.groupedTracks.clear();
    tracks.forEach(track => {
      if (!this.groupedTracks.has(track.category)) {
        this.groupedTracks.set(track.category, []);
      }
      this.groupedTracks.get(track.category)!.push(track);
    });
  }



}
