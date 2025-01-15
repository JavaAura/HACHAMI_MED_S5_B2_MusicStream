import * as fromTracks from '../../state/tracks/tracks.reducer';
import * as TrackSelectors from '../../state/tracks/tracks.selectors'
import { Track, CategoryType } from '../../models/track.interface';

describe('Track Selectors', () => {
  const mockTrack1: Track = {
    id: '1',
    songName: 'Song 1',
    singerName: 'Singer 1',
    category: CategoryType.POP,
    dateAdded: new Date('2023-01-01'),
    duration: 180,
    imageUrl: 'url1'
  };

  const mockTrack2: Track = {
    id: '2',
    songName: 'Song 2',
    singerName: 'Singer 2',
    category: CategoryType.ROCK,
    dateAdded: new Date('2023-01-02'),
    duration: 240,
    imageUrl: 'url2'
  };

  const initialState: fromTracks.TrackState = {
    tracks: [mockTrack1, mockTrack2],
    currentTrack: mockTrack1,
    loading: false,
    error: null,
    isPlaying: true
  };

  const mockState = {
    track: initialState
  };

  describe('selectTrackState', () => {
    it('should select the track state', () => {
      const result = TrackSelectors.selectTrackState(mockState);
      expect(result).toEqual(initialState);
    });
  });

  describe('selectAllTracks', () => {
    it('should select all tracks', () => {
      const result = TrackSelectors.selectAllTracks(mockState);
      expect(result).toEqual([mockTrack1, mockTrack2]);
    });
  });

  describe('selectCurrentTrack', () => {
    it('should select the current track', () => {
      const result = TrackSelectors.selectCurrentTrack(mockState);
      expect(result).toEqual(mockTrack1);
    });
  });

  describe('selectIsLoading', () => {
    it('should select the loading state', () => {
      const result = TrackSelectors.selectIsLoading(mockState);
      expect(result).toBeFalsy();
    });
  });

  describe('selectError', () => {
    it('should select the error state', () => {
      const result = TrackSelectors.selectError(mockState);
      expect(result).toBeNull();
    });
  });

  describe('selectIsPlaying', () => {
    it('should select the isPlaying state', () => {
      const result = TrackSelectors.selectIsPlaying(mockState);
      expect(result).toBeTruthy();
    });
  });

  describe('selectTrackById', () => {
    it('should select a track by id', () => {
      const result = TrackSelectors.selectTrackById('1')(mockState);
      expect(result).toEqual(mockTrack1);
    });

    it('should return undefined for non-existent track id', () => {
      const result = TrackSelectors.selectTrackById('3')(mockState);
      expect(result).toBeUndefined();
    });
  });
});

