import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useWatchlist } from '../../hooks/useWatchlist';
import { StarIcon, BookmarkIcon } from '../ui/Icons';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({ isOpen, onClose }) => {
  const { items, toggleWatchlist, count } = useWatchlist();
  const navigate = useNavigate();

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 7, 10, 0.75)',
              backdropFilter: 'blur(6px)'
            }}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#12141a',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookmarkIcon size={20} color="var(--accent, #e5a93b)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  My Watchlist ({count})
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#717686',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#717686' }}>
                  <p style={{ fontSize: '0.95rem', margin: '0 0 8px 0', color: '#9da2b4' }}>
                    Your watchlist is empty
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#525766' }}>
                    Click &quot;Save&quot; on any movie card to store it here.
                  </span>
                </div>
              ) : (
                items.map(movie => (
                  <div
                    key={movie.slug}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={{
                        width: '54px',
                        height: '76px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        onClose();
                        navigate(`/movie/${movie.slug}`);
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <h4
                          onClick={() => {
                            onClose();
                            navigate(`/movie/${movie.slug}`);
                          }}
                          style={{
                            margin: '0 0 4px 0',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          {movie.title}
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.75rem',
                            color: '#9da2b4'
                          }}
                        >
                          <span>{movie.year}</span>
                          <span>•</span>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              color: '#e5a93b'
                            }}
                          >
                            <StarIcon size={12} />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/movie/${movie.slug}`);
                          }}
                          style={{
                            backgroundColor: 'var(--accent, #e5a93b)',
                            color: '#08090c',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Watch
                        </button>
                        <button
                          onClick={() => toggleWatchlist(movie.slug)}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#717686',
                            border: 'none',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};