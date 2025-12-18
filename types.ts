export enum MediaStatus {
  Watchlist = 'WATCHLIST',
  Watched = 'WATCHED',
}

export interface MediaItem {
  id: string;
  title: string;
  year: number;
  description: string;
  type: 'Pel·lícula' | 'Sèrie';
  platform: string;
  platformDomain?: string;
  posterUrl: string;
  backdropUrl?: string;
  status: MediaStatus;
  seasons?: number;
  episodesPerSeason?: number[];
  duration?: number;
  userRating?: number;
}