import React, { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getAllMedia } from '../../lib/movies';
import type { MediaItem } from '../../types/movie';
import { SearchIcon, StarIcon } from '../ui/Icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const navigate = useNavigate();
  const searchInputId = useId();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const all = getAllMedia();
    const q = query.toLowerCase();
    const filtered = all.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.genres.some(g => g.toLowerCase().includes(q)) ||
        (item.director && item.director.toLowerCase().includes(q)) ||
        (item.cast && item.cast.some(c => c.toLowerCase().includes(q)))
    );
    setResults(filtered);
  }, [query]);

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

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 10, 0.85)',
            backdropFilter: 'blur(8px)'
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '620px',
            backgroundColor: 'var(--bg-surface-elevated, #16181f)',
            border: '1px solid var(--border-prominent, rgba(255,255,255,0.15))',
            borderRadius: '12px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
            overflow: 'hidden',
            zIndex: 1
          }}
        >
          {/* Input Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              gap: '12px'
            }}
          >
            <label htmlFor={searchInputId} style={{ display: 'flex', alignItems: 'center', cursor: 'text' }}>
              <SearchIcon size={20} color="var(--accent, #e5a93b)" />
            </label>
            <input
              id={searchInputId}
              type="text"
              autoFocus
              placeholder="Search by title, genre, actor, or director..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={onClose}
              style={{
                color: 'var(--text-muted, #717686)',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {/* Live Search Results */}
          <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '10px' }}>
            {query.trim() && results.length === 0 && (
              <div style={{ padding: '30px', textAlign: 'center', color: '#717686', fontSize: '0.9rem' }}>
                No titles found matching &quot;{query}&quot;
              </div>
            )}

            {results.map(item => (
              <div
                key={item.slug}
                onClick={() => {
                  onClose();
                  navigate(`/movie/${item.slug}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  style={{ width: '42px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: 0 }}>{item.title}</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#717686' }}>{item.year}</span>
                    <span style={{ fontSize: '0.75rem', color: '#717686' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: '#717686' }}>{item.genres.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e5a93b', fontSize: '0.85rem' }}>
                  <StarIcon size={14} />
                  <span>{item.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};