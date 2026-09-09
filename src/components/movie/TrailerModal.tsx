import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerId?: string; 
  movieTitle: string;
  movieYear?: number;
}

// Simple in-memory cache so re-opening the same movie's trailer during
// the same page visit never calls the API twice. sessionStorage backs
// it up across the tab's lifetime (cleared when the tab closes).
const trailerCache = new Map<string, string | null>();

function getCacheKey(title: string, year?: number) {
  return `${title}::${year ?? ''}`;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerId,
  movieTitle,
  movieYear
}) => {
  const [resolvedId, setResolvedId] = useState<string | null>(trailerId ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // If this movie already has a trailerId hardcoded in its JSON,
    // use it directly -- no API call needed.
    if (trailerId) {
      setResolvedId(trailerId);
      return;
    }

    const cacheKey = getCacheKey(movieTitle, movieYear);

    // Check in-memory cache first, then sessionStorage
    if (trailerCache.has(cacheKey)) {
      const cached = trailerCache.get(cacheKey) ?? null;
      setResolvedId(cached);
      return;
    }

    const stored = sessionStorage.getItem(`trailer:${cacheKey}`);
    if (stored !== null) {
      const cached = stored === 'null' ? null : stored;
      trailerCache.set(cacheKey, cached);
      setResolvedId(cached);
      return;
    }

    // Not cached anywhere -- fetch from our Cloudflare Function
    setLoading(true);
    setResolvedId(null);

    const params = new URLSearchParams({ title: movieTitle });
    if (movieYear) params.set('year', String(movieYear));

    fetch(`/api/trailer?${params.toString()}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch trailer');
        return data;
      })
      .then((data: { trailerId: string | null }) => {
        trailerCache.set(cacheKey, data.trailerId);
        sessionStorage.setItem(`trailer:${cacheKey}`, data.trailerId ?? 'null');
        setResolvedId(data.trailerId);
      })
      .catch(() => {
        setResolvedId(null);
      })
      .finally(() => setLoading(false));
  }, [isOpen, trailerId, movieTitle, movieYear]);

  if (!isOpen) return null;

  const embedUrl = resolvedId
    ? `https://www.youtube-nocookie.com/embed/${resolvedId}?autoplay=1&rel=0`
    : null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Video Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '860px',
            backgroundColor: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            zIndex: 1
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              backgroundColor: '#12141a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>
              {movieTitle} — Official Trailer
            </span>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9da2b4',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '2px 6px'
              }}
            >
              ✕
            </button>
          </div>

          {/* 16:9 Aspect Ratio Iframe */}
          <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            {loading ? (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#717686',
                  fontSize: '0.9rem'
                }}
              >
                Looking for a trailer...
              </div>
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${movieTitle} Trailer`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9da2b4',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  padding: '0 24px'
                }}
              >
                No trailer available for this title yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
