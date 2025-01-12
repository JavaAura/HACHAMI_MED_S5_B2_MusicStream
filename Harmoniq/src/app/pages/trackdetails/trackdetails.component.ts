import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Track, CategoryType } from '../../models/track.interface';
import { PlayerService } from '../../service/player.service';
import { TrackService } from '../../service/track.service';
import * as TrackSelectors from '../../state/tracks/tracks.selectors';
import * as TrackActions from '../../state/tracks/tracks.actions';

interface Album {
  title: string;
  imageUrl: string;
}

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'trackdetails.component.html'
})
export class TrackDetailsComponent implements OnInit, OnDestroy {
  track$: Observable<Track | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isCurrentlyPlaying = false;
  albumCover = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NC8bUMXRA7qG9cvRKLDK1kzlbqO44U.png';

  private routerSubscription: Subscription;
  private trackSubscription: Subscription;

  relatedAlbums: Album[] = [
    { title: 'Album 1', imageUrl:this.albumCover},
    { title: 'Album 2', imageUrl:this.albumCover},
    { title: 'Album 3', imageUrl:this.albumCover},
    { title: 'Album 4', imageUrl:this.albumCover},
    { title: 'Album 5', imageUrl:this.albumCover},
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private trackPlayerService: PlayerService,
    private trackService: TrackService,
    private sanitizer: DomSanitizer
  ) {
    this.track$ = this.store.select(TrackSelectors.selectCurrentTrack);
    this.loading$ = this.store.select(TrackSelectors.selectIsLoading);
    this.error$ = this.store.select(TrackSelectors.selectError);

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadTrackFromRoute();
    });

    this.trackSubscription = combineLatest([
      this.store.select(TrackSelectors.selectCurrentTrack),
      this.store.select(TrackSelectors.selectIsPlaying)
    ]).subscribe(([currentTrack, isPlaying]) => {
      this.isCurrentlyPlaying = isPlaying;
    });
  }

  ngOnInit(): void {
    this.loadTrackFromRoute();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.trackSubscription?.unsubscribe();
  }

  private loadTrackFromRoute(): void {
    const trackId = this.route.snapshot.paramMap.get('id');
    if (trackId) {
      this.store.dispatch(TrackActions.loadTrack({ id: trackId }));
      this.trackService.getTrackById(trackId).subscribe(track => {
        if (track) {
          this.store.dispatch(TrackActions.selectTrack({ track }));
        }
      });
    }
  }

  playTrack(track: Track): void {
    if (this.isCurrentlyPlaying) {
      this.trackPlayerService.pauseTrack();
    } else {
      this.trackPlayerService.playTrack(track);
    }
  }

  getSafeImageUrl(url: string | undefined | null): SafeStyle {
    return url ? this.sanitizer.bypassSecurityTrustStyle(`url(${url})`) : 'none';
  }

  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatCategory(category: CategoryType): string {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }
}

