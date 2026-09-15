import React, { useRef } from 'react';
import type { MediaItem } from '../../types/movie';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  subtitle?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, items, subtitle }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!items.length) return null;

  return (
    <section style={{ margin: '38px 0', position: 'relative' }}>
      <div
        className="site-container"
        style={{
          marginBottom: '14px'
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        ref={rowRef}
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '14px',
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
              width: 'clamp(130px, 40vw, 200px)',
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
