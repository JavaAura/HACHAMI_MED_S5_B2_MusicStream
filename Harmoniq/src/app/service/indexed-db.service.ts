import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../models/track.interface';
import { AudioBlob } from '../models/audio-blob.model';
import { ImageBlob } from '../models/image-blob.interface';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'musicPlayerDB';
  private readonly DB_VERSION = 2;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create 'tracks' store if it doesn't exist
        if (!db.objectStoreNames.contains('tracks')) {
          db.createObjectStore('tracks', { keyPath: 'id' });
        }

        // Create 'audioFiles' store if it doesn't exist
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        }

        // Create 'imageFiles' store if it doesn't exist
        if (!db.objectStoreNames.contains('imageFiles')) {
          db.createObjectStore('imageFiles', { keyPath: 'id' });
        }

        // Update the DB version if necessary
        db.close(); // Close the connection to allow upgrade
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
    });
  }


  // private initDB(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

  //     request.onerror = () => reject(request.error);

  //     request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  //       const db = (event.target as IDBOpenDBRequest).result;

  //       // Create 'tracks' store if it doesn't exist
  //       if (!db.objectStoreNames.contains('tracks')) {
  //         db.createObjectStore('tracks', { keyPath: 'id' });
  //       }

  //       // Create 'audioFiles' store if it doesn't exist
  //       if (!db.objectStoreNames.contains('audioFiles')) {
  //         db.createObjectStore('audioFiles', { keyPath: 'id' });
  //       }
  //       // create 'imageFiles' store if it doesn't exist
  //       if (!db.objectStoreNames.contains('imageFiles')) {
  //         db.createObjectStore('imageFiles', { keyPath: 'id' });
  //       }
  //     };

  //     request.onsuccess = () => {
  //       this.db = request.result;
  //       resolve();
  //     };
  //   });
  // }

  async addFile(storeName: string, data: any, imageData?: any): Promise<void> {
    await this.initDB();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFiles(storeName: string): Promise<any[]> {
    await this.initDB();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAudioFile(id: string): Promise<any> {
    await this.initDB();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction('audioFiles', 'readonly');
      const store = transaction.objectStore('audioFiles');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTrack(track: Track, audioFile?: File, imageFile?: File): Promise<Track> {
    try {
      await this.initDB();
      if (!this.db) throw new Error('Database not initialized');

      // Save track data
      const transaction = this.db.transaction(['tracks'], 'readwrite');
      const trackStore = transaction.objectStore('tracks');

      await new Promise<void>((resolve, reject) => {
        const request = trackStore.put(track);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Handle audio file
      if (audioFile) {
        await this.saveFile('audioFiles', track.id, audioFile);
      }

      // Handle image file using the new method
      if (imageFile) {
        await this.addImageFile(track.id, imageFile);
      }

      return track;
    } catch (error) {
      console.error('Error updating track:', error);
      throw error;
    }
  }

  private async saveFile(storeName: string, id: string, file: File): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    //


    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const transaction = this.db!.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);

          const fileData = {
            id: id,
            data: new Blob([reader.result as ArrayBuffer], { type: file.type }),
            type: file.type,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified
          };

          const request = store.put(fileData);

          request.onsuccess = () => {
            console.log(`Successfully saved ${storeName} with id: ${id}`);
            resolve();
          };

          request.onerror = () => {
            console.error(`Error saving ${storeName}:`, request.error);
            reject(request.error);
          };
        } catch (error) {
          console.error(`Error in ${storeName} save operation:`, error);
          reject(error);
        }
      };

      reader.onerror = () => {
        console.error(`Error reading ${storeName}:`, reader.error);
        reject(reader.error);
      };

      try {
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error(`Error starting file read for ${storeName}:`, error);
        reject(error);
      }
    });
  }

  async getImageFile(id: string): Promise<ImageBlob> {
    try {
      await this.initDB();
      if (!this.db) throw new Error('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction('imageFiles', 'readonly');
        const store = transaction.objectStore('imageFiles');
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            reject(new Error(`Image with id ${id} not found`));
          }
        };

        request.onerror = () => {
          console.error('Error fetching image:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getImageFile:', error);
      throw error;
    }
  }

  async deleteTrack(id: string): Promise<void> {
    await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['tracks', 'audioFiles', 'imageFiles'], 'readwrite');
    const trackStore = transaction.objectStore('tracks');
    const audioStore = transaction.objectStore('audioFiles');
    const imageStore = transaction.objectStore('imageFiles');

    return new Promise((resolve, reject) => {
      const trackRequest = trackStore.delete(id);
      const audioRequest = audioStore.delete(id);
      const imageRequest = imageStore.delete(id);

      trackRequest.onerror = () => reject(trackRequest.error);
      audioRequest.onerror = () => reject(audioRequest.error);
      imageRequest.onerror = () => reject(imageRequest.error);

      transaction.oncomplete = () => resolve();
    });
  }

  async addImageFile(id: string, imageFile: File): Promise<void> {
    try {
      await this.initDB();
      if (!this.db) throw new Error('Database not initialized');

      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const transaction = this.db!.transaction('imageFiles', 'readwrite');
            const store = transaction.objectStore('imageFiles');

            const imageData = {
              id: id,
              data: new Blob([reader.result as ArrayBuffer], { type: imageFile.type }),
              type: imageFile.type,
              name: imageFile.name,
              size: imageFile.size,
              lastModified: imageFile.lastModified
            };

            const request = store.put(imageData);

            request.onsuccess = () => {
              console.log(`Successfully saved image with id: ${id}`);
              resolve();
            };

            request.onerror = () => {
              console.error('Error saving image:', request.error);
              reject(request.error);
            };
          } catch (error) {
            console.error('Error in image save operation:', error);
            reject(error);
          }
        };

        reader.onerror = () => {
          console.error('Error reading image file:', reader.error);
          reject(reader.error);
        };

        reader.readAsArrayBuffer(imageFile);
      });
    } catch (error) {
      console.error('Error in addImageFile:', error);
      throw error;
    }
  }

  async updateFile(storeName: string, data: any, imageFile?: File): Promise<void> {
    await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    // Handle image file first if present
    if (imageFile) {
      await this.updateImageFile(data.id, imageFile);
    }

    // Then update the main data
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateImageFile(id: string, imageFile: File): Promise<void> {
    return this.addImageFile(id, imageFile);
  }

  async getImageData(id: string): Promise<any> {
    await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('imageFiles', 'readonly');
      const store = transaction.objectStore('imageFiles');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

}
