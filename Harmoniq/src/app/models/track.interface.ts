export interface Track {
  id: string;
  songName: string;
  singerName: string;
  category: CategoryType;
  description?: string;
  dateAdded: Date;
  duration: number;
  imageUrl?: string | null;
}


export enum CategoryType {
  POP = 'pop',
  ROCK = 'rock',
  RAP = 'rap',
  CHA3BI = 'cha3bi',
  RAI = 'rai'
}
