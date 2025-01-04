import { Component, OnInit, ElementRef } from '@angular/core';
import { HeroComponent } from '../../UI/hero/hero.component';
import { TrackCardComponent } from '../../UI/track-card/track-card.component';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  standalone: true,
  imports: [HeroComponent,TrackCardComponent],
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent  {

  }


