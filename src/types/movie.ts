export interface Movie {
  id?: number;
  slug: string;
  title: string;
  type?: string;
  year: number;
  rating: number;
  runtime: number;
  poster: string;
  backdrop: string;
  description: string;
  genres: string[];
  director: string;
  cast: string[];
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
}
export type MediaItem = Movie;