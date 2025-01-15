import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackCardComponent } from './track-card.component';
import { PlayerService } from '../../service/player/player.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Track, CategoryType } from '../../models/track.interface';
import { By } from '@angular/platform-browser';

describe('TrackCardComponent', () => {
  let component: TrackCardComponent;
  let fixture: ComponentFixture<TrackCardComponent>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;

  const mockTrack: Track = {
    id: '1',
    songName: 'Test Song',
    singerName: 'Test Singer',
    category: CategoryType.POP,
    description: 'Test Description',
    dateAdded: new Date(),
    duration: 180,
    imageUrl: 'test-image-url'
  };

  beforeEach(async () => {
    mockPlayerService = jasmine.createSpyObj('PlayerService', ['playTrack']);

    await TestBed.configureTestingModule({
      imports: [TrackCardComponent, RouterTestingModule],
      providers: [
        { provide: PlayerService, useValue: mockPlayerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackCardComponent);
    component = fixture.componentInstance;
    component.track = mockTrack;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct track', () => {
    expect(component.track).toEqual(mockTrack);
  });

  it('should call playTrack method when play button is clicked', () => {
    const playButton = fixture.debugElement.query(By.css('.play-button'));
    playButton.triggerEventHandler('click', null);
    expect(mockPlayerService.playTrack).toHaveBeenCalledWith(mockTrack);
  });

  it('should display the correct track information', () => {
    const songNameElement = fixture.debugElement.query(By.css('.song-name'));
    const singerNameElement = fixture.debugElement.query(By.css('.singer-name'));
    const categoryElement = fixture.debugElement.query(By.css('.category'));

    expect(songNameElement.nativeElement.textContent).toContain(mockTrack.songName);
    expect(singerNameElement.nativeElement.textContent).toContain(mockTrack.singerName);
    expect(categoryElement.nativeElement.textContent).toContain(mockTrack.category);
  });

  it('should not call playTrack if track id is missing', () => {
    const trackWithoutId: Partial<Track> = { ...mockTrack, id: undefined };
    component.track = trackWithoutId as Track;
    component.playTrack();
    expect(mockPlayerService.playTrack).not.toHaveBeenCalled();
  });

  it('should log error if track id is missing when trying to play', () => {
    spyOn(console, 'error');
    const trackWithoutId: Partial<Track> = { ...mockTrack, id: undefined };
    component.track = trackWithoutId as Track;
    component.playTrack();
    expect(console.error).toHaveBeenCalledWith('Track ID is missing or invalid');
  });

  it('should have a link to track details', () => {
    const detailsLink = fixture.debugElement.query(By.css('a[routerLink]'));
    expect(detailsLink.attributes['ng-reflect-router-link']).toBe('/track/' + mockTrack.id);
  });

  // Additional tests for onEdit and onDelete methods can be added here
  // when these methods are implemented
});

