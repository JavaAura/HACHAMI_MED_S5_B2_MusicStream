export interface TrackMetadata {
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

export interface Track {
  id: string;
  metadata: TrackMetadata;
  audioBlob: Blob;
  imageBlob?: Blob;
}
