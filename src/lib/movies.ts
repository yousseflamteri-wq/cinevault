import { Movie } from '../types/movie';
import interstellar from '../data/movies/interstellar.json';
import inception from '../data/movies/inception.json';
import dune from '../data/movies/dune-part-two.json';

const fallbackMovies: Movie[] = [
  interstellar as Movie,
  inception as Movie,
  dune as Movie,
];

export async function getAllMovies(): Promise<Movie[]> {
  try {
    const response = await fetch('/api/movies');
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return fallbackMovies;
  } catch {
    return fallbackMovies;
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  const movies = await getAllMovies();
  return movies.find((m) => m.slug === slug);
}
