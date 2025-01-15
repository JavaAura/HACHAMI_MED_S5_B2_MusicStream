import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('PlayerService', () => {
  let service: PlayerService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        provideMockStore({}) // Provide a mock store
      ],
    });

    service = TestBed.inject(PlayerService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests here to cover service functionality
});
