import { Injectable } from '@angular/core';
import { Track, TrackMetadata } from '../models/track.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
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

  async saveTrack(track: Track): Promise<Track> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.TRACKS_STORE, this.METADATA_STORE], 'readwrite');
      const tracksStore = transaction.objectStore(this.TRACKS_STORE);
      const trackRequest = tracksStore.add({
        audioBlob: track.audioBlob,
        imageBlob: track.imageBlob
      });

      trackRequest.onsuccess = () => {
        const trackId = trackRequest.result as number;
        const metadataStore = transaction.objectStore(this.METADATA_STORE);
        const metadata = {
          ...track.metadata,
          id: trackId
        };

        const metadataRequest = metadataStore.add(metadata);

        metadataRequest.onsuccess = () => resolve({
          id: trackId.toString(),
          metadata,
          audioBlob: track.audioBlob,
          imageBlob: track.imageBlob
        });
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
          id: (metadata.id ?? Date.now()).toString(),
          metadata,
          audioBlob: trackData.audioBlob,
          imageBlob: trackData.imageBlob
        });
      }).catch(reject);
    });
  }

  async getAllTracks(): Promise<Track[]> {
    try {
      if (!this.db) {
        console.log('Initializing DB...');
        await this.initDB();
      }

      if (!this.db) {
        throw new Error('Database initialization failed');
      }

      console.log('Getting all tracks...');

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.TRACKS_STORE, this.METADATA_STORE], 'readonly');
        const metadataStore = transaction.objectStore(this.METADATA_STORE);
        const tracksStore = transaction.objectStore(this.TRACKS_STORE);

        const tracks: Track[] = [];

        const metadataRequest = metadataStore.getAll();

        metadataRequest.onsuccess = async () => {
          const metadata = metadataRequest.result;
          console.log('Metadata count:', metadata.length);

          try {
            for (const meta of metadata) {
              console.log('Processing metadata:', meta);
              const trackRequest = tracksStore.get(meta.id);

              const trackData = await new Promise<{audioBlob: Blob, imageBlob?: Blob}>((resolve, reject) => {
                trackRequest.onsuccess = () => {
                  console.log('Track data retrieved for id:', meta.id);
                  resolve(trackRequest.result);
                };
                trackRequest.onerror = () => reject(trackRequest.error);
              });

              if (!trackData) {
                console.warn(`No track data found for metadata id: ${meta.id}`);
                continue;
              }

              tracks.push({
                id: meta.id.toString(),
                metadata: meta,
                audioBlob: trackData.audioBlob,
                imageBlob: trackData.imageBlob
              });
            }

            console.log('Final tracks count:', tracks.length);
            resolve(tracks);
          } catch (error) {
            console.error('Error processing tracks:', error);
            reject(error);
          }
        };

        metadataRequest.onerror = (event) => {
          console.error('Metadata request failed:', event);
          reject(metadataRequest.error);
        };

        transaction.onerror = (event) => {
          console.error('Transaction failed:', event);
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('getAllTracks error:', error);
      throw error;
    }
  }
}
