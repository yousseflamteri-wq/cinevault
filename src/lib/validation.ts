import type { MediaItem } from '../types/movie';

export function validateMediaItem(filepath: string, rawData: unknown): MediaItem {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error(`[CineVault]: File "${filepath}" is not a valid JSON object.`);
  }

  const data = rawData as Partial<MediaItem>;
  const missing: string[] = [];

  if (!data.slug) missing.push('slug');
  if (!data.title) missing.push('title');
  if (!data.type) missing.push('type ("movie" | "tv")');
  if (typeof data.year !== 'number') missing.push('year');
  if (!data.poster) missing.push('poster');
  if (!data.backdrop) missing.push('backdrop');
  if (!data.description) missing.push('description');
  if (!Array.isArray(data.genres)) missing.push('genres');
  if (typeof data.rating !== 'number') missing.push('rating');
  if (!Array.isArray(data.cast)) missing.push('cast');

  if (missing.length > 0) {
    throw new Error(`\n[CineVault Validation Error] ${filepath}\nMissing: ${missing.join(', ')}\n`);
  }

  return data as MediaItem;
}