export interface ImageBlob {
  id: string;
  data: Blob;
  type: string;
  name: string;
  size: number;
  lastModified: number;
}
