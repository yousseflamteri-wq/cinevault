import React, { useRef } from 'react';
import type { MediaItem } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  subtitle?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, items, subtitle }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollDistance = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  if (!items.length) return null;

  return (
    <section style={{ margin: '38px 0', position: 'relative' }}>
      <div
        className="site-container"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h2>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            aria-label="Scroll left"
            onClick={() => scroll('left')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll('right')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingLeft: 'clamp(16px, 4vw, 48px)',
          paddingRight: 'clamp(16px, 4vw, 48px)',
          paddingBottom: '12px'
        }}
      >
        {items.map(item => (
          <div
            key={item.slug}
            style={{
              flex: '0 0 auto',
              width: 'clamp(170px, 18vw, 220px)',
              scrollSnapAlign: 'start'
            }}
          >
            <MovieCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};