import type { Movie } from '../types/movie';
import interstellar from '../data/movies/interstellar.json';
import inception from '../data/movies/inception.json';
import dune from '../data/movies/dune-part-two.json';

// Base movie array from local JSON
export const movies: Movie[] = [
  interstellar as Movie,
  inception as Movie,
  dune as Movie,
];

// Alias export to prevent useWatchlist.ts from breaking
export const catalog: Movie[] = movies;

// Synchronous fetcher for generic components
export function getAllMovies(): Movie[] {
  return movies;
}

// Synchronous fetcher specifically for App.tsx and SearchModal.tsx
export function getAllMedia(): Movie[] {
  return movies;
}

// Asynchronous fetcher for MediaDetails.tsx targeting the Cloudflare D1 API
export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  try {
    const res = await fetch('/api/movies');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const found = data.find((m: Movie) => m.slug === slug);
        if (found) return found;
      }
    }
  } catch {
    // Fallback to local files if the API is offline or unreachable
  }
  return movies.find((m) => m.slug === slug);
}
