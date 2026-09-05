import { Movie } from '../types/movie';
import interstellar from '../data/movies/interstellar.json';
import inception from '../data/movies/inception.json';
import dune from '../data/movies/dune-part-two.json';

// Static fallback data always available synchronously
export const movies: Movie[] = [
  interstellar as Movie,
  inception as Movie,
  dune as Movie,
];

// Synchronous getters so existing UI components don't break
export function getAllMovies(): Movie[] {
  return movies;
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}

// Async API fetcher for when you want live D1 updates
export async function fetchLiveMovies(): Promise<Movie[]> {
  try {
    const res = await fetch('/api/movies');
    if (!res.ok) return movies;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : movies;
  } catch {
    return movies;
  }
}
