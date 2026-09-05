import type { Movie } from '../types/movie';
import interstellar from '../data/movies/interstellar.json';
import inception from '../data/movies/inception.json';
import dune from '../data/movies/dune-part-two.json';

export const movies: Movie[] = [
  interstellar as Movie,
  inception as Movie,
  dune as Movie,
];

export const catalog: Movie[] = movies;

export function getAllMovies(): Movie[] {
  return movies;
}

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
    // Fallback to local files if offline or API is unreachable
  }
  return movies.find((m) => m.slug === slug);
}
