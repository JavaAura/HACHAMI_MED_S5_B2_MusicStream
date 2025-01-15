import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map } from 'rxjs';
import { Track } from '../../models/track.interface';
import * as TrackActions from '../../state/tracks/tracks.actions';
import * as TrackSelectors from '../../state/tracks/tracks.selectors';
import { AlertService } from '../../service/alert/alert.service';
import { AppState } from '../../state/store/app.state';
import { Router } from '@angular/router';
import { TrackCardComponent } from '../../UI/track-card/track-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../service/search/search.service';
import { TrackState } from '../../state/tracks/tracks.reducer';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  standalone: true,
  imports: [TrackCardComponent, CommonModule, RouterModule],
  styleUrls: ['./tracks.component.scss'],
})
export class TracksComponent implements OnInit, OnDestroy {
  selectedTrack: Track | null = null;
  tracks$: Observable<Track[]> = this.store.select(TrackSelectors.selectAllTracks);
  loading$: Observable<boolean> = this.store.select(TrackSelectors.selectTrackState).pipe(
    map((state: TrackState) => state.loading)
  );
  currentlyPlaying$: Observable<Track | null> = this.store.select(TrackSelectors.selectCurrentTrack);
  private tracks: Track[] = [];
  allTracks: Track[] = [];
  filteredTracks: Track[] = [];
  groupedTracks: Map<string, Track[]> = new Map();
  private searchSubscription: Subscription | null = null;

  constructor(
    private store: Store<AppState>,
    private alertService: AlertService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TrackActions.loadTracks());

    this.tracks$.subscribe(tracks => {
      this.tracks = tracks;
      this.allTracks = tracks;
      this.filteredTracks = tracks;
      this.groupTracksByCategory(this.filteredTracks);
    });

    this.searchSubscription = this.searchService.currentSearchTerm$.subscribe(searchTerm => {
      this.filterTracks(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.tracks.forEach(track => {
      if (track.imageUrl) {
        URL.revokeObjectURL(track.imageUrl);
      }
    });

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private filterTracks(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredTracks = this.allTracks;
    } else {
      searchTerm = searchTerm.toLowerCase();
      this.filteredTracks = this.allTracks.filter(track =>
        track.songName.toLowerCase().includes(searchTerm) ||
        track.singerName.toLowerCase().includes(searchTerm)
      );
    }
    this.groupTracksByCategory(this.filteredTracks);
  }

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

