import { TestBed } from '@angular/core/testing';

import { TrackPlayerService } from './track-player.service';

describe('TrackPlayerService', () => {
  let service: TrackPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
