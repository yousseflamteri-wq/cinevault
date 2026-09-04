import { useState, useEffect, useCallback } from 'react';
import { catalog } from '../lib/movies';
import type { MediaItem } from '../types/movie';

const STORAGE_KEY = 'cinevault_watchlist';

export function useWatchlist() {
  const [watchlistSlugs, setWatchlistSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistSlugs));
    } catch (err) {
      console.warn('Failed to save watchlist:', err);
    }
  }, [watchlistSlugs]);

  const inWatchlist = useCallback(
    (slug: string) => watchlistSlugs.includes(slug),
    [watchlistSlugs]
  );

  const toggleWatchlist = useCallback((slug: string) => {
    setWatchlistSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }, []);

  const items: MediaItem[] = catalog.filter(m => watchlistSlugs.includes(m.slug));

  return {
    items,
    inWatchlist,
    toggleWatchlist,
    count: watchlistSlugs.length
  };
}