import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Track {
  name: string;
  artist: string;
  description?: string;
  category: string;
  audioFile?: File;
  imageFile?: File;
}

@Component({
  selector: 'app-new-track-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-track-modal.component.html',
  styleUrl: './new-track-modal.component.scss'
})
export class NewTrackModalComponent {
  newTrack: Track = {
    name: '',
    artist: '',
    description: '',
    category: ''
  };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newTrack.audioFile = file;
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newTrack.imageFile = file;
    }
  }

  onSubmit(): void {
    // Validate form
    if (!this.newTrack.name || !this.newTrack.artist || !this.newTrack.category || !this.newTrack.audioFile) {
      // Handle validation error
      console.error('Please fill in all required fields');
      return;
    }

    // Here you would typically:
    // 1. Create FormData object
    // 2. Send to your backend service
    // 3. Handle response
    console.log('Submitting track:', this.newTrack);

    // Close modal after successful submission
    const modal = document.getElementById('new_track_modal') as HTMLDialogElement;
    modal.close();

    // Reset form
    this.resetForm();
  }

  private resetForm(): void {
    this.newTrack = {
      name: '',
      artist: '',
      description: '',
      category: ''
    };
  }
}
