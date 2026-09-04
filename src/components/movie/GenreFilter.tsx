import React from 'react';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenre,
  onSelectGenre
}) => {
  return (
    <div className="site-container" style={{ position: 'relative', zIndex: 12, marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '10px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {genres.map(genre => {
          const isActive = selectedGenre.toLowerCase() === genre.toLowerCase();
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--accent, #e5a93b)' : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? '#08090c' : 'var(--text-secondary, #9da2b4)',
                border: isActive ? '1px solid var(--accent, #e5a93b)' : '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 16px rgba(229, 169, 59, 0.4)' : 'none'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'var(--text-secondary, #9da2b4)';
                }
              }}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};