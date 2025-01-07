import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  standalone: true,
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent  {
//   private audio = new Audio();
//   currentTrack$ = this.store.select(selectCurrentTrack);
//   isPlaying$ = this.store.select(selectIsPlaying);
//   progress$ = this.store.select(selectProgress);
//   volume$ = this.store.select(selectVolume);

//   constructor(private store: Store) {}
// ngOnInit() {
//     this.currentTrack$.subscribe(track => {
//       if (track) {
//         this.audio.src = track.audioUrl;
//         this.audio.load();
//       }
//     });

//     this.isPlaying$.subscribe(isPlaying => {
//       if (isPlaying) {
//         this.audio.play();
//       } else {
//         this.audio.pause();
//       }
//     });

//     this.audio.addEventListener('timeupdate', () => {
//       const progress = (this.audio.currentTime / this.audio.duration) * 100;
//       this.store.dispatch(AudioPlayerActions.updateProgress({ progress }));
//     });

//     this.audio.addEventListener('ended', () => {
//       this.store.dispatch(AudioPlayerActions.next());
//     });
//   }

//   togglePlay() {
//     this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
//       if (isPlaying) {
//         this.store.dispatch(AudioPlayerActions.pause());
//       } else {
//         this.store.dispatch(AudioPlayerActions.play());
//       }
//     });
//   }

//   onProgressChange(event: Event) {
//     const progress = +(event.target as HTMLInputElement).value;
//     const time = (progress / 100) * this.audio.duration;
//     this.audio.currentTime = time;
//     this.store.dispatch(AudioPlayerActions.updateProgress({ progress }));
//   }

//   onVolumeChange(event: Event) {
//     const volume = +(event.target as HTMLInputElement).value;
//     this.audio.volume = volume;
//     this.store.dispatch(AudioPlayerActions.setVolume({ volume }));
//   }

}
