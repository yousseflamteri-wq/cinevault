import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, BookmarkIcon } from '../ui/Icons';
import { SearchModal } from '../search/SearchModal';
import { WatchlistDrawer } from '../watchlist/WatchlistDrawer';
import { useWatchlist } from '../../hooks/useWatchlist';

export const Navbar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const { count } = useWatchlist();
  const location = useLocation();

  const isMoviePage = location.pathname.startsWith('/movie/');

  useEffect(() => {
    setSearchOpen(false);
    setWatchlistOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/?type=movie' }
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          zIndex: 50,
          backgroundColor: 'rgba(8, 9, 12, 0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          className="site-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {/* Brand Logo & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#fff',
                  textTransform: 'uppercase'
                }}
              >
                Cine<span style={{ color: 'var(--accent, #e5a93b)' }}>Vault</span>
              </span>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
              {navLinks.map(link => {
                const isActive = location.pathname + location.search === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    style={{
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--accent, #e5a93b)' : 'var(--text-secondary, #9da2b4)'
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!isMoviePage && (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary, #9da2b4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px'
                }}
              >
                <SearchIcon size={20} />
              </button>
            )}

            {/* Clickable Watchlist Trigger */}
            <button
              onClick={() => setWatchlistOpen(true)}
              aria-label="Open Watchlist"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <BookmarkIcon size={20} color="var(--text-secondary, #9da2b4)" />
              {count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    backgroundColor: 'var(--accent, #e5a93b)',
                    color: '#08090c',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <WatchlistDrawer isOpen={watchlistOpen} onClose={() => setWatchlistOpen(false)} />
    </>
  );
};