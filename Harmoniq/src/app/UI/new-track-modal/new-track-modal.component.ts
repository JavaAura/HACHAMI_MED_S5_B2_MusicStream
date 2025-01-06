import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackStorageService } from '../../service/track-storage.service';

interface ValidationError {
  invalidFormat?: boolean;
  maxSize?: boolean;
  required?: boolean;
}

@Component({
  selector: 'app-new-track-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './new-track-modal.component.html',
  styleUrl: './new-track-modal.component.scss'
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
    private trackStorage: TrackStorageService
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
    if (this.trackForm.valid) {
      try {
        const formData = this.trackForm.value;
        const trackData = {
          metadata: {
            name: formData.name,
            artist: formData.artist,
            description: formData.description,
            category: formData.category,
            createdAt: new Date().toISOString(),
            fileSize: formData.audioFile.size,
            fileType: formData.audioFile.type,
            hasImage: !!formData.imageFile
          },
          audioBlob: formData.audioFile,
          imageBlob: formData.imageFile
        };

        const trackId = await this.trackStorage.saveTrack(trackData);
        console.log('Track saved successfully with ID:', trackId);
        // Handle success (close modal, show success message, etc.)

      } catch (error) {
        console.error('Error submitting track:', error);
        // Handle error appropriately (show user feedback)
      }
    }
  }
}
