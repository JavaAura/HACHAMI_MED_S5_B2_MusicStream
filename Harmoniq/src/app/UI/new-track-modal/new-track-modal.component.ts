import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../service/track.service';
import { Store } from '@ngrx/store';
import * as TracksActions from '../../state/tracks/tracks.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';


interface ValidationError {
  invalidFormat?: boolean;
  maxSize?: boolean;
  required?: boolean;
}

@Component({
  selector: 'app-new-track-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ToastModule,
    ButtonModule
  ],
  templateUrl: './new-track-modal.component.html',
  styleUrl: './new-track-modal.component.scss',
  providers: [MessageService]
})
export class NewTrackModalComponent implements OnInit {
  trackForm!: FormGroup;
  audioFileValidated = false;
  imageFileValidated = false;

  private readonly AUDIO_MAX_SIZE = 45 * 1024 * 1024; // Corrected to 15MB in bytes
  private readonly IMAGE_MAX_SIZE = 40 * 1024 * 1024;  // 2MB in bytes
  private readonly ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg','audio/mpeg','audio/x-wav','audio/mpeg3'];
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private store: Store,
    private actions$: Actions,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.trackForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      category: ['', Validators.required],
      audioFile: [null, [Validators.required]],
      imageFile: [null]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validationError = this.validateAudioFile(file);
      if (validationError) {
        this.trackForm.get('audioFile')?.setErrors(validationError);
        this.audioFileValidated = false;
        return;
      }
      this.trackForm.patchValue({ audioFile: file });
      this.audioFileValidated = true;
      // Clear previous errors
      this.trackForm.get('audioFile')?.setErrors(null);
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validationError = this.validateImageFile(file);
      if (validationError) {
        this.trackForm.get('imageFile')?.setErrors(validationError);
        this.imageFileValidated = false;
        return;
      }
      this.trackForm.patchValue({ imageFile: file });
      this.imageFileValidated = true;
    }
  }

  private validateAudioFile(file: File): ValidationError | null {
    // Check if file exists
    if (!file) {
      return { required: true };
    }

    // Check file format
    if (!this.ALLOWED_AUDIO_TYPES.includes(file.type)) {
      console.log('Invalid format:', file.type);
      return { invalidFormat: true };
    }

    // Check file size
    if (file.size > this.AUDIO_MAX_SIZE) {
      console.log('File too large:', file.size);
      return { maxSize: true };
    }

    return null;
  }

  private validateImageFile(file: File): ValidationError | null {
    // Check file format
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { invalidFormat: true };
    }

    // Check file size
    if (file.size > this.IMAGE_MAX_SIZE) {
      return { maxSize: true };
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.trackForm.valid && this.audioFileValidated) {
      try {
        const formData = this.trackForm.value;

        if (!formData.audioFile) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No audio file selected'
          });
          return;
        }

        const trackData = {
          id: Date.now().toString(),
          metadata: {
            name: formData.name.trim(),
            artist: formData.artist.trim(),
            description: formData.description?.trim(),
            category: formData.category,
            createdAt: new Date().toISOString(),
            fileSize: formData.audioFile.size,
            fileType: formData.audioFile.type,
            hasImage: !!formData.imageFile
          },
          audioBlob: formData.audioFile,
          imageBlob: formData.imageFile || null
        };

        this.store.dispatch(TracksActions.addTrack({ track: trackData }));

        this.actions$.pipe(
          ofType(TracksActions.addTrackSuccess, TracksActions.addTrackFailure),
          take(1)
        ).subscribe(action => {
          if (action.type === '[Tracks] Add Track Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Track added successfully!'
            });
            this.trackForm.reset();
            this.audioFileValidated = false;
            this.imageFileValidated = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add track. Please try again.'
            });
          }
        });

      } catch (error) {
        console.error('Error submitting track:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred. Please try again.'
        });
        throw error;
      }
    } else {
      console.error('Form validation failed', {
        formValid: this.trackForm.valid,
        audioValidated: this.audioFileValidated,
        formErrors: this.trackForm.errors
      });
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.'
      });
    }
  }

  show() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Track added successfully'
    });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content'
    });
  }
}
