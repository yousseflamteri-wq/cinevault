import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import type { MediaItem } from '../../types/movie';
import { PlayIcon, BookmarkIcon, StarIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useMovieImages } from '../../hooks/useMovieImages';

interface HeroProps {
  items?: MediaItem[];
  item?: MediaItem;
}

export const Hero: React.FC<HeroProps> = ({ items, item }) => {
  // Safely fallback so the component never crashes if items is missing or empty
  const mediaList: MediaItem[] = items && items.length > 0 
    ? items 
    : (item ? [item] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { inWatchlist, toggleWatchlist } = useWatchlist();

  const safeIndex = mediaList.length > 0 ? currentIndex % mediaList.length : 0;
  const currentItem = mediaList[safeIndex];
  const saved = currentItem ? inWatchlist(currentItem.slug) : false;

  const { backdrop } = useMovieImages(
    currentItem ?? { title: '', year: 0, poster: '', backdrop: '' }
  );

  // Auto-slide every 5 seconds; pauses when mouse is hovering
  useEffect(() => {
    if (isPaused || mediaList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % mediaList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, mediaList.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % mediaList.length);
  };

  if (!currentItem) return null;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '80vh',
        height: 'clamp(540px, 80vh, 740px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Animated Backdrop Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.slug}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backdrop})`,
            backgroundPosition: 'center 20%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(8,9,12,0.95) 0%, rgba(8,9,12,0.65) 45%, rgba(8,9,12,0.2) 100%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, #08090c 0%, rgba(8,9,12,0.6) 30%, transparent 60%)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero Movie Details */}
      <div className="site-container" style={{ position: 'relative', zIndex: 2, paddingTop: '40px', width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
            style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#08090c',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                Featured
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{currentItem.year}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 700 }}>
                <StarIcon size={14} />
                <span>{currentItem.rating.toFixed(1)}</span>
              </div>
              {currentItem.runtime && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{currentItem.runtime} min</span>
                </>
              )}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}
            >
              {currentItem.title}
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {currentItem.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', margin: '4px 0', flexWrap: 'wrap' }}>
              {currentItem.genres.map(genre => (
                <span
                  key={genre}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-primary)',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Navigates directly to /movie/:slug */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
              <Link to={`/movie/${currentItem.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#08090c',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '12px 26px',
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: 'var(--accent-glow)'
                  }}
                >
                  <PlayIcon size={18} />
                  <span>Watch Now</span>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleWatchlist(currentItem.slug)}
                style={{
                  backgroundColor: saved ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                  color: saved ? '#08090c' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '12px 22px',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                {saved ? <CheckIcon size={18} /> : <BookmarkIcon size={18} />}
                <span>{saved ? 'In Watchlist' : 'Add to List'}</span>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Slide Arrows and Indicators */}
      {mediaList.length > 1 && (
        <div
          style={{
            position: 'absolute',
            right: 'clamp(16px, 4vw, 48px)',
            bottom: '40px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ChevronLeftIcon size={20} />
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {mediaList.map((m, idx) => (
              <button
                key={m.slug}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === safeIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: idx === safeIndex ? 'var(--accent)' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next slide"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      )}
    </section>
  );
};
