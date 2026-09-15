import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { MediaItem } from '../../types/movie';
import { StarIcon, BookmarkIcon, CheckIcon } from '../ui/Icons';
import { useMovieImages } from '../../hooks/useMovieImages';
import { useWatchlist } from '../../hooks/useWatchlist';

export const MovieCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const { poster } = useMovieImages(item);
  const { inWatchlist, toggleWatchlist } = useWatchlist();
  const saved = inWatchlist(item.slug);

  return (
    <Link to={`/movie/${item.slug}`} style={{ display: 'block' }}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          width: '100%',
          paddingTop: '150%'
        }}
      >
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

        {/* Bookmark toggle, top-left, matching reference */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatchlist(item.slug);
          }}
          aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: saved ? 'var(--accent, #e5a93b)' : '#fff',
            cursor: 'pointer',
            zIndex: 2
          }}
        >
          {saved ? <CheckIcon size={16} /> : <BookmarkIcon size={16} />}
        </button>

        {/* Rating badge, top-right, matching reference */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            borderRadius: '999px',
            padding: '4px 9px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#e5a93b'
          }}
        >
          <StarIcon size={12} />
          <span>{item.rating.toFixed(1)}</span>
        </div>

        {/* Bottom gradient + title/year, overlaid directly on the poster */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(8,9,12,0.95) 0%, rgba(8,9,12,0.55) 45%, transparent 75%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px'
          }}
        >
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)'
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.75)',
              marginTop: '2px',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)'
            }}
          >
            {item.year}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
