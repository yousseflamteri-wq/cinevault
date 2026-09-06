import type { Movie } from '../types/movie';
import interstellar from '../data/movies/interstellar.json';
import inception from '../data/movies/inception.json';
import dune from '../data/movies/dune-part-two.json';

export const movies: Movie[] = [
  interstellar as Movie,
  inception as Movie,
  dune as Movie,
];

export async function getAllMovies(): Promise<Movie[]> {
  try {
    const res = await fetch('/api/movies');
    if (!res.ok) return movies;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : movies;
  } catch {
    return movies;
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  const allMovies = await getAllMovies();
  return allMovies.find((m) => m.slug === slug);
}
export const catalog = movies;