import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    StoreModule.forRoot({})
  ],
  exports: [
    BrowserAnimationsModule
  ],
  providers: [
    provideMockStore({
      initialState: {
        tracks: [],
        currentTrack: null,
        isPlaying: false
      }
    })
  ]
})
export class TestModule { }
