import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTrackModalComponent } from './new-track-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { TrackService } from '../../service/track/track.service';
import { of } from 'rxjs';
import * as TracksActions from '../../state/tracks/tracks.actions';

describe('NewTrackModalComponent', () => {
  let component: NewTrackModalComponent;
  let fixture: ComponentFixture<NewTrackModalComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockActions: jasmine.SpyObj<Actions>;
  let mockTrackService: jasmine.SpyObj<TrackService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockActions = jasmine.createSpyObj('Actions', ['pipe']);
    mockTrackService = jasmine.createSpyObj('TrackService', ['addTrack']);

    await TestBed.configureTestingModule({
      imports: [NewTrackModalComponent, ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Actions, useValue: mockActions },
        { provide: TrackService, useValue: mockTrackService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.trackForm).toBeDefined();
    expect(component.trackForm.get('name')).toBeTruthy();
    expect(component.trackForm.get('artist')).toBeTruthy();
    expect(component.trackForm.get('description')).toBeTruthy();
    expect(component.trackForm.get('category')).toBeTruthy();
    expect(component.trackForm.get('audioFile')).toBeTruthy();
    expect(component.trackForm.get('imageFile')).toBeTruthy();
  });

  it('should validate audio file format', () => {
    const file = new File([''], 'test.mp3', { type: 'audio/mp3' });
    const event = { target: { files: [file] } };
    component.onFileSelected(event);
    expect(component.audioFileValidated).toBeTrue();
  });

 

  it('should validate image file format', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };
    component.onImageSelected(event);
    expect(component.imageFileValidated).toBeTrue();
  });

  it('should invalidate incorrect image file format', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };
    component.onImageSelected(event);
    expect(component.imageFileValidated).toBeFalse();
    expect(component.trackForm.get('imageFile')?.hasError('invalidFormat')).toBeTrue();
  });

  it('should submit the form when valid', async () => {
    const mockModal = { close: jasmine.createSpy('close') } as any;
    component.trackForm.setValue({
      name: 'Test Track',
      artist: 'Test Artist',
      description: 'Test Description',
      category: 'pop',
      audioFile: new File([''], 'test.mp3', { type: 'audio/mp3' }),
      imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' })
    });
    component.audioFileValidated = true;

    await component.onSubmit(mockModal);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.any(Object)
    );
    expect(mockModal.close).toHaveBeenCalled();
  });

  it('should not submit the form when invalid', async () => {
    const mockModal = { close: jasmine.createSpy('close') } as any;
    component.trackForm.setValue({
      name: '',
      artist: '',
      description: '',
      category: '',
      audioFile: null,
      imageFile: null
    });

    await component.onSubmit(mockModal);

    expect(mockStore.dispatch).not.toHaveBeenCalled();
    expect(mockModal.close).not.toHaveBeenCalled();
  });
});

