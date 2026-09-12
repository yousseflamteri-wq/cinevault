import { useEffect, useState } from 'react';
import type { Movie } from '../types/movie';

interface ResolvedImages {
  poster: string;
  backdrop: string;
}

// In-memory + sessionStorage cache, keyed by title+year, so the same
// movie is only looked up once per browser session no matter how many
// rows/pages render it (Trending, Highest Rated, its own detail page, etc).
const imageCache = new Map<string, ResolvedImages>();

function cacheKey(title: string, year?: number) {
  return `${title}::${year ?? ''}`;
}

function readCache(key: string): ResolvedImages | undefined {
  if (imageCache.has(key)) return imageCache.get(key);
  const stored = sessionStorage.getItem(`movie-images:${key}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ResolvedImages;
      imageCache.set(key, parsed);
      return parsed;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

// Returns the best available poster/backdrop for a movie. Per the site's
// design, TMDB is always treated as the source of truth over whatever is
// hardcoded in the movie's local JSON file: the JSON value is returned
// immediately as a placeholder (so there's no blank flash), then swapped
// for the TMDB result once it resolves. If TMDB has no match, the JSON
// value stays as the final answer.
export function useMovieImages(movie: Pick<Movie, 'title' | 'year' | 'poster' | 'backdrop'>): ResolvedImages {
  const [images, setImages] = useState<ResolvedImages>({
    poster: movie.poster,
    backdrop: movie.backdrop
  });

  const key = cacheKey(movie.title, movie.year);

  useEffect(() => {
    const cached = readCache(key);
    if (cached) {
      setImages(cached);
      return;
    }

    const params = new URLSearchParams({ title: movie.title });
    if (movie.year) params.set('year', String(movie.year));

    fetch(`/api/movie-images?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { poster: string | null; backdrop: string | null }) => {
        const resolved: ResolvedImages = {
          poster: data.poster ?? movie.poster,
          backdrop: data.backdrop ?? movie.backdrop
        };
        imageCache.set(key, resolved);
        sessionStorage.setItem(`movie-images:${key}`, JSON.stringify(resolved));
        setImages(resolved);
      })
      .catch(() => {
        // Leave the JSON fallback in place on any failure
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return images;
}
