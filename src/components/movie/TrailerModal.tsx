import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  movieTitle: string;
}

// Direct YouTube trailer IDs
const TRAILERS: Record<string, string> = {
  'dune-part-two': 'Way9Dexny3w',
  'inception': 'YoHD9XEInc0',
  'interstellar': 'zSWdZVtXT7E'
};

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  slug,
  movieTitle
}) => {
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

  if (!isOpen) return null;

  const videoId = TRAILERS[slug];
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(movieTitle + ' official trailer')}&autoplay=1`;

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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};