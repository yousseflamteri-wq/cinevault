export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  slug: string;
  title: string;
  type: MediaType;
  year: number;
  poster: string;
  backdrop: string;
  description: string;
  genres: string[];
  rating: number;
  runtime?: number;
  seasons?: number;
  episodes?: number;
  director?: string;
  creator?: string;
  cast: string[];
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  releaseDate?: string;
  trailerUrl?: string;
  ageRating?: string;
  tagline?: string;
}

export type SortOption = 'trending' | 'rating' | 'newest' | 'oldest' | 'title';

export interface FilterCriteria {
  type?: MediaType | 'all';
  genre?: string;
  year?: number | 'all';
  minRating?: number;
  sortBy?: SortOption;
  searchQuery?: string;
}