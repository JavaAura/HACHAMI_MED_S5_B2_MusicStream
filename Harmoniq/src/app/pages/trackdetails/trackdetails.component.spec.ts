import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackDetailsComponent } from './trackdetails.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router, NavigationEnd, ParamMap, convertToParamMap, ActivatedRouteSnapshot } from '@angular/router';
import { PlayerService } from '../../service/player/player.service';
import { TrackService } from '../../service/track/track.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../service/alert/alert.service';
import { of, Subject } from 'rxjs';
import { Track, CategoryType } from '../../models/track.interface';
import * as TrackSelectors from '../../state/tracks/tracks.selectors';
import * as TrackActions from '../../state/tracks/tracks.actions';

describe('TrackDetailsComponent', () => {
  let component: TrackDetailsComponent;
  let fixture: ComponentFixture<TrackDetailsComponent>;
  let mockStore: MockStore;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockRouter: Partial<Router>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;
  let mockTrackService: jasmine.SpyObj<TrackService>;
  let mockDomSanitizer: jasmine.SpyObj<DomSanitizer>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockTrack: Track = {
    id: '1',
    songName: 'Test Song',
    singerName: 'Test Singer',
    category: CategoryType.POP,
    dateAdded: new Date(),
    duration: 180,
    imageUrl: 'test-url'
  };

  beforeEach(async () => {
    const paramMap = convertToParamMap({ id: '1' });
    const mockSnapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap,
      url: [],
      params: { id: '1' },
      queryParams: {},
      fragment: null,
      data: {},
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      queryParamMap: convertToParamMap({}),
    };

    mockActivatedRoute = {
      snapshot: mockSnapshot as ActivatedRouteSnapshot
    };

    const navigationEndEvents = new Subject<NavigationEnd>();
    mockRouter = {
      events: navigationEndEvents.asObservable(),
      navigate: jasmine.createSpy('navigate')
    };

    mockPlayerService = jasmine.createSpyObj('PlayerService', ['playTrack', 'pauseTrack']);
    mockTrackService = jasmine.createSpyObj('TrackService', ['getTrackById']);
    mockDomSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustStyle']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [TrackDetailsComponent],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: PlayerService, useValue: mockPlayerService },
        { provide: TrackService, useValue: mockTrackService },
        { provide: DomSanitizer, useValue: mockDomSanitizer },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    spyOn(mockStore, 'dispatch').and.callThrough();

    mockStore.overrideSelector(TrackSelectors.selectCurrentTrack, mockTrack);
    mockStore.overrideSelector(TrackSelectors.selectIsLoading, false);
    mockStore.overrideSelector(TrackSelectors.selectError, null);
    mockStore.overrideSelector(TrackSelectors.selectIsPlaying, false);

    mockTrackService.getTrackById.and.returnValue(of(mockTrack));

    fixture = TestBed.createComponent(TrackDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load track from route on init', () => {
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(TrackActions.loadTrack({ id: '1' }));
    expect(mockTrackService.getTrackById).toHaveBeenCalledWith('1');
  });

  it('should play track when not currently playing', () => {
    component.playTrack(mockTrack);
    expect(mockPlayerService.playTrack).toHaveBeenCalledWith(mockTrack);
  });

  it('should pause track when currently playing', () => {
    component.isCurrentlyPlaying = true;
    component.playTrack(mockTrack);
    expect(mockPlayerService.pauseTrack).toHaveBeenCalled();
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(180)).toBe('3:00');
    expect(component.formatDuration(65)).toBe('1:05');
  });

  it('should format category correctly', () => {
    expect(component.formatCategory(CategoryType.POP)).toBe('Pop');
    expect(component.formatCategory(CategoryType.ROCK)).toBe('Rock');
  });

  it('should delete track when confirmed', async () => {
    mockAlertService.confirm.and.returnValue(Promise.resolve(true));
    await component.onDelete(mockTrack);
    expect(mockStore.dispatch).toHaveBeenCalledWith(TrackActions.deleteTrack({ id: mockTrack.id }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tracks']);
  });

  it('should not delete track when not confirmed', async () => {
    mockAlertService.confirm.and.returnValue(Promise.resolve(false));
    await component.onDelete(mockTrack);
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});

