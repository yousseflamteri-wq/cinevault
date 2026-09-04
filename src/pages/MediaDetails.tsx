import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMediaBySlug, getSimilarMedia } from '../lib/movies';
import { MovieRow } from '../components/movie/MovieRow';
import { WatchUnlockModal } from '../components/movie/WatchUnlockModal';
import { TrailerModal } from '../components/movie/TrailerModal';
import { DownloadOptions } from '../components/movie/DownloadOptions';
import { Footer } from '../components/layout/Footer';
import { PlayIcon, StarIcon, BookmarkIcon, CheckIcon } from '../components/ui/Icons';
import { useWatchlist } from '../hooks/useWatchlist';

export const MediaDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showBack, setShowBack] = useState(true);
  const { inWatchlist, toggleWatchlist } = useWatchlist();
  const downloadSectionRef = useRef<HTMLDivElement>(null);

  // Reset scroll and mirror visibility when switching movies
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setShowBack(true);
    setShowDownloads(false);
  }, [slug]);

  // Back button auto-hide on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setShowBack(false);
      } else {
        setShowBack(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadClick = () => {
    setShowDownloads(true);
    setTimeout(() => {
      downloadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const movie = slug ? getMediaBySlug(slug) : undefined;
  const similar = movie ? getSimilarMedia(movie) : [];
  const saved = movie ? inWatchlist(movie.slug) : false;

  if (!movie) {
    return (
      <div className="site-container" style={{ paddingTop: '140px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>Movie not found</h2>
        <Link to="/" style={{ color: 'var(--accent, #e5a93b)', marginTop: '12px', display: 'inline-block' }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas, #08090c)', position: 'relative' }}>
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Return to previous page"
        style={{
          position: 'fixed',
          top: '78px',
          left: '16px',
          zIndex: 60,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(8, 9, 12, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
          opacity: showBack ? 1 : 0,
          transform: showBack ? 'translateY(0)' : 'translateY(-16px)',
          pointerEvents: showBack ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Back</span>
      </button>

      {/* Backdrop Header */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '68vh',
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage: `url(${movie.backdrop})`,
          backgroundPosition: 'center 25%',
          backgroundSize: 'cover',
          paddingBottom: '40px',
          paddingTop: '100px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, #08090c 0%, rgba(8,9,12,0.8) 50%, rgba(8,9,12,0.3) 100%)'
          }}
        />

        <div className="site-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--text-secondary, #9da2b4)', fontSize: '0.85rem' }}>{movie.year}</span>
              <span style={{ color: 'var(--text-muted, #717686)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e5a93b', fontWeight: 700 }}>
                <StarIcon size={14} />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              {movie.runtime && (
                <>
                  <span style={{ color: 'var(--text-muted, #717686)' }}>•</span>
                  <span style={{ color: 'var(--text-secondary, #9da2b4)', fontSize: '0.85rem' }}>{movie.runtime} min</span>
                </>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
              {movie.title}
            </h1>

            <p style={{ color: 'var(--text-secondary, #9da2b4)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {movie.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {movie.genres.map(g => (
                <span
                  key={g}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff'
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              {/* 1. Watch Movie Now */}
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  backgroundColor: 'var(--accent, #e5a93b)',
                  color: '#08090c',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <PlayIcon size={18} />
                <span>Watch Movie Now</span>
              </button>

              {/* 2. Download Button (Triggers High-Speed Mirrors) */}
              <button
                onClick={handleDownloadClick}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download</span>
              </button>

              {/* 3. Watch Trailer */}
              <button
                onClick={() => setTrailerOpen(true)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Watch Trailer</span>
              </button>

              {/* 4. Watchlist Toggle */}
              <button
                onClick={() => toggleWatchlist(movie.slug)}
                style={{
                  backgroundColor: saved ? 'var(--accent, #e5a93b)' : 'rgba(255,255,255,0.08)',
                  color: saved ? '#08090c' : '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {saved ? <CheckIcon size={18} /> : <BookmarkIcon size={18} />}
                <span>{saved ? 'In List' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct High-Speed Mirrors (Revealed only when Download button is clicked) */}
      {showDownloads && (
        <div ref={downloadSectionRef} className="site-container" style={{ scrollMarginTop: '90px' }}>
          <DownloadOptions
            movieTitle={movie.title}
            onSelectDownload={() => setModalOpen(true)}
          />
        </div>
      )}

      {/* Cast & Info */}
      <div className="site-container" style={{ padding: '30px 0' }}>
        {movie.director && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #9da2b4)' }}>
            <strong style={{ color: '#fff' }}>Director:</strong> {movie.director}
          </p>
        )}
        {movie.cast && movie.cast.length > 0 && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #9da2b4)', marginTop: '6px' }}>
            <strong style={{ color: '#fff' }}>Starring:</strong> {movie.cast.join(', ')}
          </p>
        )}
      </div>

      {/* More Like This Row */}
      {similar.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <MovieRow title="More Like This" items={similar} subtitle="Related movies you might enjoy" />
        </div>
      )}

      {/* Compliance Footer */}
      <Footer />

      {/* Gateway Modal */}
      <WatchUnlockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        movieTitle={movie.title}
      />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        slug={movie.slug}
        movieTitle={movie.title}
      />
    </div>
  );
};