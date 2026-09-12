import type { Movie } from '../types/movie';

// Scores every candidate against the source movie and returns the best
// matches. Score components, roughly weighted by how strong a signal
// each one is for "you'll probably like this too":
//
//   - shared genres: +2 per genre in common (main signal)
//   - same director: +3 (a strong, specific signal)
//   - shared cast members: +1 per actor in common
//   - closeness in release year: up to +1, decaying with distance
//
// Ties are broken with a small random jitter so the row isn't
// byte-for-byte identical across every page load/visit.
export function getRelatedMovies(source: Movie, all: Movie[], limit = 10): Movie[] {
  const sourceGenres = new Set(source.genres);
  const sourceCast = new Set(source.cast ?? []);

  const scored = all
    .filter(m => m.slug !== source.slug)
    .map(m => {
      const sharedGenres = m.genres.filter(g => sourceGenres.has(g)).length;
      const sameDirector = source.director && m.director === source.director ? 1 : 0;
      const sharedCast = (m.cast ?? []).filter(c => sourceCast.has(c)).length;
      const yearGap = Math.abs((m.year ?? 0) - (source.year ?? 0));
      const yearCloseness = Math.max(0, 1 - yearGap / 20); // full credit if same year, fades over ~20 years

      const score =
        sharedGenres * 2 +
        sameDirector * 3 +
        sharedCast * 1 +
        yearCloseness +
        Math.random() * 0.1; // tiny jitter to break ties differently each visit

      return { movie: m, score, sharedGenres };
    })
    // Require at least one real signal in common -- otherwise "related"
    // becomes meaningless (e.g. two movies that share nothing but a
    // release decade shouldn't show up as "similar").
    .filter(entry => entry.sharedGenres > 0 || entry.score > 1)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(entry => entry.movie);
}
