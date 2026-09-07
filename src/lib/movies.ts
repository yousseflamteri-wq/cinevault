import type { Movie } from '../types/movie';

// Dynamically import every .json file under src/data/movies/ at build time.
// eager: true inlines the JSON content directly (no async chunks needed),
// so this behaves exactly like the old static imports but with zero
// per-file maintenance -- just drop a new .json file in the folder.
const movieModules = import.meta.glob('../data/movies/*.json', { eager: true });

// Each module's default export is the JSON content, typed as Movie.
const rawMovies: Movie[] = Object.values(movieModules).map(
  (mod) => (mod as { default: Movie }).default
);

// How many titles count as "trending" at any given time.
const TRENDING_COUNT = 10;

// Automatically mark the N most recent titles as trending, based on
// release year (ties broken alphabetically by slug for stable ordering).
// This replaces hand-editing "trending": true/false in each JSON file --
// as newer movies are added, older ones fall out of the top N on their own.
function withComputedTrending(list: Movie[]): Movie[] {
  const newestFirst = [...list].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.slug.localeCompare(b.slug);
  });

  const trendingSlugs = new Set(newestFirst.slice(0, TRENDING_COUNT).map((m) => m.slug));

  return list.map((m) => ({
    ...m,
    trending: trendingSlugs.has(m.slug)
  }));
}

export const movies: Movie[] = withComputedTrending(rawMovies);

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
  const localMatch = movies.find((m) => m.slug === slug);

  try {
    const res = await fetch('/api/movies');
    if (res.ok) {
      const data: unknown = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const rawMatch = data.find(
          (m) => (m as Record<string, unknown>).slug === slug
        );

        if (rawMatch) {
          try {
            const record = rawMatch as Record<string, unknown>;
            const formatted: Movie = {
              ...(record as unknown as Movie),
              genres:
                typeof record.genres === 'string'
                  ? (JSON.parse(record.genres) as string[])
                  : (record.genres as string[]),
              cast:
                typeof record.cast === 'string'
                  ? (JSON.parse(record.cast) as string[])
                  : (record.cast as string[])
            };
            return formatted;
          } catch {
            // This D1 row is malformed (e.g. bad JSON in genres/cast).
            // Don't let one bad record break the whole page -- use the
            // local JSON version of this movie if we have one.
            if (localMatch) return localMatch;
          }
        }
      }
    }
  } catch {
    // API unreachable/offline -- fall back to local files below.
  }

  return localMatch;
}
