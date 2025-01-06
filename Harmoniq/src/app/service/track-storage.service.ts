import { Injectable } from '@angular/core';

interface TrackMetadata {
  id?: number;
  name: string;
  artist: string;
  description: string;
  category: string;
  createdAt: string;
  fileSize: number;
  fileType: string;
  hasImage: boolean;
}

interface Track {
  metadata: TrackMetadata;
  audioBlob: Blob;
  imageBlob?: Blob;
}

@Injectable({
  providedIn: 'root'
})
export class TrackStorageService {
  private readonly DB_NAME = 'musicPlayerDB';
  private readonly DB_VERSION = 1;
  private readonly TRACKS_STORE = 'tracks';
  private readonly METADATA_STORE = 'metadata';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create tracks store for audio and image blobs
        if (!db.objectStoreNames.contains(this.TRACKS_STORE)) {
          db.createObjectStore(this.TRACKS_STORE, { keyPath: 'id', autoIncrement: true });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains(this.METADATA_STORE)) {
          const metadataStore = db.createObjectStore(this.METADATA_STORE, { keyPath: 'id', autoIncrement: true });
          metadataStore.createIndex('name', 'name', { unique: false });
          metadataStore.createIndex('artist', 'artist', { unique: false });
          metadataStore.createIndex('category', 'category', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
    });
  }

  async saveTrack(track: Track): Promise<number> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.TRACKS_STORE, this.METADATA_STORE], 'readwrite');

      // Save track data (blobs)
      const tracksStore = transaction.objectStore(this.TRACKS_STORE);
      const trackRequest = tracksStore.add({
        audioBlob: track.audioBlob,
        imageBlob: track.imageBlob
      });

      trackRequest.onsuccess = () => {
        const trackId = trackRequest.result as number;

        // Save metadata with the same ID
        const metadataStore = transaction.objectStore(this.METADATA_STORE);
        const metadata = {
          ...track.metadata,
          id: trackId
        };

        const metadataRequest = metadataStore.add(metadata);

        metadataRequest.onsuccess = () => resolve(trackId);
        metadataRequest.onerror = () => reject(metadataRequest.error);
      };

      trackRequest.onerror = () => reject(trackRequest.error);

      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getTrack(id: number): Promise<Track> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.TRACKS_STORE, this.METADATA_STORE], 'readonly');

      const tracksStore = transaction.objectStore(this.TRACKS_STORE);
      const metadataStore = transaction.objectStore(this.METADATA_STORE);

      const trackRequest = tracksStore.get(id);
      const metadataRequest = metadataStore.get(id);

      Promise.all([
        new Promise<{audioBlob: Blob, imageBlob?: Blob}>(resolve =>
          trackRequest.onsuccess = () => resolve(trackRequest.result)
        ),
        new Promise<TrackMetadata>(resolve =>
          metadataRequest.onsuccess = () => resolve(metadataRequest.result)
        )
      ]).then(([trackData, metadata]) => {
        resolve({
          metadata,
          audioBlob: trackData.audioBlob,
          imageBlob: trackData.imageBlob
        });
      }).catch(reject);
    });
  }
}
