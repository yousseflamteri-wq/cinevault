import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { MediaItem } from '../../types/movie';
import { StarIcon } from '../ui/Icons';
import { useMovieImages } from '../../hooks/useMovieImages';

export const MovieCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const { poster } = useMovieImages(item);

  return (
    <Link to={`/movie/${item.slug}`} style={{ display: 'block' }}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ position: 'relative', width: '100%', paddingTop: '145%', overflow: 'hidden' }}>
          <img
            src={poster}
            alt={item.title}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,9,12,0.95) 0%, rgba(8,9,12,0.2) 60%, transparent 100%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              right: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)' }}>
              <StarIcon size={14} />
              <span>{item.rating.toFixed(1)}</span>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>{item.year}</span>
          </div>
        </div>

        <div style={{ padding: '14px 12px' }}>
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {item.title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {item.genres.slice(0, 2).join(' • ')}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
