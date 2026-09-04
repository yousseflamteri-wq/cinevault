import type { MediaItem } from '../types/movie';
import { validateMediaItem } from './validation';

const movieModules = import.meta.glob('../data/movies/*.json', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>;

const tvModules = import.meta.glob('../data/tv/*.json', {
  eager: true,
  import: 'default'
}) as Record<string, unknown>;

function loadCatalog(): MediaItem[] {
  const items: MediaItem[] = [];

  for (const [path, content] of Object.entries(movieModules)) {
    try {
      items.push(validateMediaItem(path, content));
    } catch (err) {
      console.error(err);
    }
  }

  for (const [path, content] of Object.entries(tvModules)) {
    try {
      items.push(validateMediaItem(path, content));
    } catch (err) {
      console.error(err);
    }
  }

  return items;
}

export const catalog: MediaItem[] = loadCatalog();

export const getAllMedia = (): MediaItem[] => [...catalog];

export const getMediaBySlug = (slug: string): MediaItem | undefined => {
  return catalog.find(item => item.slug === slug);
};

export const getSimilarMedia = (current: MediaItem, limit = 4): MediaItem[] => {
  return catalog
    .filter(item => item.slug !== current.slug)
    .filter(item => item.genres.some((g: string) => current.genres.includes(g)))
    .slice(0, limit);
};