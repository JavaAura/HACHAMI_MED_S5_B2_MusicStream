import { Injectable } from '@angular/core';
import { Observable, from, mergeMap, map } from 'rxjs';
import {CategoryType, Track} from '../models/track.interface'
import { IndexedDBService } from './indexed-db.service';


@Injectable({
  providedIn: 'root'
})
export class TrackService {

  // Define allowed formats and max size
  private allowedAudioFormats = [
    'audio/mp3',
    'audio/mpeg',
    'audio/mpeg3',
    'audio/x-mpeg-3',
    'audio/wav',
    'audio/ogg',
  ];

  private allowedImageFormats = [
    'image/jpeg',
    'image/png',
  ];

  private maxAudioSize = 15 * 1024 * 1024;


  constructor(private db: IndexedDBService) {}

  createTrack(trackData: Partial<Track>, audioFile: File, imageFile?: File): Observable<Track> {
    return new Observable(observer => {
      const audio = new Audio();
      const audioFileReader = new FileReader();

      audioFileReader.onload = async () => {
        try {
          const track: Track = {
            id: crypto.randomUUID(),
            songName: trackData.songName!,
            singerName: trackData.singerName!,
            description: trackData.description,
            dateAdded: new Date(),
            duration: Math.floor(audio.duration),
            category: trackData.category || CategoryType.POP,
            imageUrl: null
          };
          if (!this.allowedAudioFormats.includes(audioFile.type)) {

            throw new Error(`Invalid file format. Supported formats are: ${this.allowedAudioFormats.join(', ')}`);
          }
          if (audioFile.size > this.maxAudioSize) {
            throw new Error(`File size exceeds the maximum limit of ${this.maxAudioSize / (1024 * 1024)}MB.`);
          }

          if (imageFile && !this.allowedImageFormats.includes(imageFile.type)) {
            throw new Error(`Invalid file format. Supported formats are: ${this.allowedImageFormats.join(', ')}`);
          }

          await this.db.addFile('tracks', track);

          const audioData = {
            id: track.id,
            name: `${track.songName}.${audioFile.name.split('.').pop()}`,
            displayName: track.songName,
            singerName: track.singerName,
            type: audioFile.type,
            data: new Blob([audioFileReader.result as ArrayBuffer], { type: audioFile.type }),
            size: audioFile.size,
            lastModified: audioFile.lastModified
          };



          await this.db.addFile('audioFiles', audioData);
          console.log('Audio file stored:', audioData.id);

          if (imageFile) {
            const imageFileReader = new FileReader();
            await new Promise<void>((resolve, reject) => {
              imageFileReader.onload = async () => {
                try {
                  const imageData = {
                    id: track.id,
                    name: imageFile.name,
                    type: imageFile.type,
                    data: new Blob([imageFileReader.result as ArrayBuffer], { type: imageFile.type }),
                    size: imageFile.size,
                    lastModified: imageFile.lastModified
                  };
                  await this.db.addFile('imageFiles', imageData);
                  console.log('Image file stored:', imageData.id);

                  track.imageUrl = URL.createObjectURL(imageData.data);

                  // Update the track with the new imageUrl in the database
                  await this.db.updateFile('tracks', track);

                  resolve();
                } catch (error) {
                  reject(error);
                }
              };
              imageFileReader.onerror = () => reject(imageFileReader.error);
              imageFileReader.readAsArrayBuffer(imageFile);
            });
          }

          observer.next(track);
          observer.complete();
        } catch (error) {
          console.error('Error in createTrack:', error);
          observer.error(error);
        }
      };

      audio.src = URL.createObjectURL(audioFile);
      audio.onloadedmetadata = () => {
        audioFileReader.readAsArrayBuffer(audioFile);
      };

      audio.onerror = () => observer.error('Failed to load audio metadata');
    });
  }

  getTracks(): Observable<Track[]> {
    return from(this.db.getAllFiles('tracks')).pipe(
      mergeMap(async (tracks: Track[]) => {
        const tracksWithImages = await Promise.all(
          tracks.map(async (track) => {
            try {
              const imageData = await this.db.getImageFile(track.id);
              return {
                ...track,
                imageUrl: imageData ? URL.createObjectURL(imageData.data) : null
              };
            } catch (error) {
              console.error(`Error fetching image for track ${track.id}:`, error);
              return track;
            }
          })
        );
        return tracksWithImages;
      })
    );
  }

  getTrackAudio(id: string): Observable<any> {
    return from(this.db.getAudioFile(id));
  }

  updateTrack(track: Track, audioFile?: File, imageFile?: File): Observable<Track> {
    return new Observable(observer => {
      try {
        const updateProcess = async () => {
          try {
            // Create a new track object
            let updatedTrack = { ...track };

            // Handle audio file update if provided
            if (audioFile) {
              // Get audio duration
              const audio = new Audio();
              const audioUrl = URL.createObjectURL(audioFile);

              await new Promise((resolve) => {
                audio.onloadedmetadata = () => {
                  updatedTrack = {
                    ...updatedTrack,
                    duration: Math.floor(audio.duration)
                  };
                  URL.revokeObjectURL(audioUrl);
                  resolve(null);
                };
                audio.src = audioUrl;
              });

              const audioBuffer = await audioFile.arrayBuffer();
              const audioData = {
                id: track.id,
                name: `${track.songName}.${audioFile.name.split('.').pop()}`,
                displayName: track.songName,
                singerName: track.singerName,
                type: audioFile.type,
                data: new Blob([audioBuffer], { type: audioFile.type }),
                size: audioFile.size,
                lastModified: audioFile.lastModified
              };
              await this.db.updateFile('audioFiles', audioData);
            }

            // Handle image file update if provided
            if (imageFile) {
              await this.db.addImageFile(track.id, imageFile);
              const imageData = await this.db.getImageFile(track.id);
              updatedTrack = {
                ...updatedTrack,
                imageUrl: URL.createObjectURL(imageData.data)
              };
            }

            // Update track metadata last
            await this.db.updateFile('tracks', updatedTrack);

            observer.next(updatedTrack);
            observer.complete();
          } catch (error) {
            console.error('Update process error:', error);
            observer.error(error);
          }
        };

        updateProcess();
      } catch (error) {
        console.error('Update track error:', error);
        observer.error(error);
      }
    });
  }

  deleteTrack(id: string): Observable<void> {
    return from(this.db.deleteTrack(id));
  }

  getTrackById(id: string): Observable<Track> {
    return from(this.db.getAllFiles('tracks')).pipe(
      mergeMap(async (tracks) => {
        const track = tracks.find((t: Track) => t.id === id);
        if (!track) throw new Error('Track not found');

        try {
          // Load image data
          const imageData = await this.db.getImageFile(track.id);
          return {
            ...track,
            imageUrl: imageData ? URL.createObjectURL(imageData.data) : null
          };
        } catch (error) {
          console.error(`Error fetching image for track ${track.id}:`, error);
          return track;
        }
      })
    );
  }

}
