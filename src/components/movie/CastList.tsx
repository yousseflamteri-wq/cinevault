import React, { useEffect, useState } from 'react';

interface CastListProps {
  director?: string;
  cast: string[];
}

// In-memory + sessionStorage cache so re-visiting a movie, or two movies
// sharing an actor, never re-fetches a photo that's already known.
const photoCache = new Map<string, string | null>();

function readCachedPhoto(name: string): string | null | undefined {
  if (photoCache.has(name)) return photoCache.get(name);
  const stored = sessionStorage.getItem(`actor-photo:${name}`);
  if (stored !== null) {
    const value = stored === 'null' ? null : stored;
    photoCache.set(name, value);
    return value;
  }
  return undefined;
}

function ActorAvatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '84px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0
        }}
      >
        {photoUrl && !imgFailed ? (
          <img
            src={photoUrl}
            alt={name}
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ color: '#717686', fontSize: '0.85rem', fontWeight: 700 }}>
            {initials || '?'}
          </span>
        )}
      </div>
      <span
        style={{
          marginTop: '8px',
          fontSize: '0.75rem',
          color: '#9da2b4',
          textAlign: 'center',
          lineHeight: 1.3
        }}
      >
        {name}
      </span>
    </div>
  );
}

export const CastList: React.FC<CastListProps> = ({ director, cast }) => {
  const [photos, setPhotos] = useState<Record<string, string | null>>({});
  const castKey = cast?.join('|') ?? '';

  useEffect(() => {
    if (!cast || cast.length === 0) return;

    // Figure out which names we don't already have cached
    const uncached: string[] = [];
    const fromCache: Record<string, string | null> = {};

    cast.forEach((name) => {
      const cached = readCachedPhoto(name);
      if (cached === undefined) {
        uncached.push(name);
      } else {
        fromCache[name] = cached;
      }
    });

    if (Object.keys(fromCache).length > 0) {
      setPhotos((prev) => ({ ...prev, ...fromCache }));
    }

    if (uncached.length === 0) return;

    const params = new URLSearchParams({ names: uncached.join(',') });

    fetch(`/api/actors?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { photos: Record<string, string | null> }) => {
        if (!data.photos) return;
        Object.entries(data.photos).forEach(([name, url]) => {
          photoCache.set(name, url);
          sessionStorage.setItem(`actor-photo:${name}`, url ?? 'null');
        });
        setPhotos((prev) => ({ ...prev, ...data.photos }));
      })
      .catch(() => {
        // Silently fall back to initials-only avatars for the uncached names
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castKey]);

  if (!cast || cast.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      {director && (
        <div style={{ fontSize: '0.85rem', color: '#717686', marginBottom: '14px' }}>
          <strong style={{ color: '#9da2b4' }}>Director:</strong> {director}
        </div>
      )}
      <div style={{ fontSize: '0.85rem', color: '#9da2b4', marginBottom: '10px', fontWeight: 600 }}>
        Cast
      </div>
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
        {cast.map((name) => (
          <ActorAvatar key={name} name={name} photoUrl={photos[name] ?? null} />
        ))}
      </div>
    </div>
  );
};
