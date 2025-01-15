import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPlayerComponent } from './audio-player.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PlayerService } from '../../service/player/player.service';
import { of } from 'rxjs';

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;
  let mockStore: MockStore;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;

  beforeEach(async () => {
    mockPlayerService = jasmine.createSpyObj('PlayerService', [
      'getCurrentTrack',
      'getProgress',
      'pauseTrack',
      'resumeTrack',
      'playNextTrack',
      'playPreviousTrack',
      'seekTo',
      'setVolume'
    ]);

    mockPlayerService.getCurrentTrack.and.returnValue(of(null));
    mockPlayerService.getProgress.and.returnValue(of({ currentTime: '0:00', duration: '0:00', progress: 0 }));

    await TestBed.configureTestingModule({
      imports: [AudioPlayerComponent],
      providers: [
        provideMockStore({}),
        { provide: PlayerService, useValue: mockPlayerService }
      ]
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here as needed
});

