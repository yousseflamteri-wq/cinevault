import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieBySlug, getAllMovies } from '../lib/movies';
import type { Movie } from '../types/movie';
import { PlayIcon, BookmarkIcon, StarIcon, CheckIcon } from '../components/ui/Icons';
import { useWatchlist } from '../hooks/useWatchlist';
import { TrailerModal } from '../components/movie/TrailerModal';
import { WatchUnlockModal } from '../components/movie/WatchUnlockModal';
import { DownloadOptions } from '../components/movie/DownloadOptions';
import { MovieRow } from '../components/movie/MovieRow';
import { CastList } from '../components/movie/CastList';

export const MediaDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const { inWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    setLoading(true);
    if (slug) {
      getMovieBySlug(slug).then((data) => {
        setMovie(data || null);
        setLoading(false);
      });
    }
    // Scroll to top whenever the slug changes
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary, #9da2b4)'
        }}
      >
        Loading...
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: '#fff',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Movie not found</h2>
        <p style={{ color: 'var(--text-secondary, #9da2b4)', margin: 0 }}>
          The title you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/"
          style={{
            marginTop: '8px',
            backgroundColor: 'var(--accent, #e5a93b)',
            color: '#08090c',
            fontWeight: 700,
            padding: '10px 22px',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const saved = inWatchlist(movie.slug);

  const related = getAllMovies()
    .filter(m => m.slug !== movie.slug && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 10);

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Backdrop hero section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${movie.backdrop || movie.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, var(--bg-canvas, #08090c) 5%, rgba(8,9,12,0.75) 45%, rgba(8,9,12,0.35) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(8,9,12,0.9) 0%, rgba(8,9,12,0.3) 55%, transparent 100%)'
          }}
        />

        <div
          className="site-container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-end',
            padding: '48px 0',
            flexWrap: 'wrap'
          }}
        >
          {/* Poster */}
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '200px',
              minWidth: '160px',
              borderRadius: '12px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          />

          {/* Info */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #9da2b4)' }}>{movie.year}</span>
              <span style={{ color: 'var(--text-muted, #717686)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e5a93b' }}>
                <StarIcon size={16} />
                <span style={{ fontWeight: 700 }}>{movie.rating.toFixed(1)}</span>
              </div>
              <span style={{ color: 'var(--text-muted, #717686)' }}>•</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #9da2b4)' }}>{movie.runtime} min</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 900,
                color: '#fff',
                margin: '0 0 14px 0',
                lineHeight: 1.1
              }}
            >
              {movie.title}
            </h1>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {movie.genres.map(genre => (
                <span
                  key={genre}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'var(--text-secondary, #9da2b4)',
                    padding: '5px 12px',
                    borderRadius: '999px'
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary, #9da2b4)',
                maxWidth: '640px',
                marginBottom: '20px'
              }}
            >
              {movie.description}
            </p>

            <CastList director={movie.director} cast={movie.cast} />

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setUnlockOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--accent, #e5a93b)',
                  color: '#08090c',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <PlayIcon size={18} />
                Watch Now
              </button>

              <button
                onClick={() => setTrailerOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <PlayIcon size={16} />
                Trailer
              </button>

              <button
                onClick={() => toggleWatchlist(movie.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: saved ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.08)',
                  color: saved ? '#22c55e' : '#fff',
                  border: saved ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {saved ? <CheckIcon size={16} /> : <BookmarkIcon size={16} />}
                {saved ? 'In My List' : 'Add to List'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download options */}
      <div className="site-container" style={{ padding: '0 clamp(16px, 4vw, 48px)' }}>
        <DownloadOptions movieTitle={movie.title} onSelectDownload={() => setUnlockOpen(true)} />
      </div>

      {/* Related titles */}
      {related.length > 0 && (
        <MovieRow title="You May Also Like" items={related} subtitle="Similar genres and themes" />
      )}

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerId={movie.trailerId}
        movieTitle={movie.title}
        movieYear={movie.year}
      />
      <WatchUnlockModal isOpen={unlockOpen} onClose={() => setUnlockOpen(false)} movieTitle={movie.title} />
    </div>
  );
};
