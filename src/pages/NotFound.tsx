import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        padding: '2rem',
        paddingTop: '100px'
      }}
    >
      <span
        style={{
          fontSize: 'clamp(4rem, 12vw, 7rem)',
          fontWeight: 900,
          color: 'var(--accent, #e5a93b)',
          lineHeight: 1
        }}
      >
        404
      </span>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
        This page went missing from the archive
      </h1>
      <p style={{ color: 'var(--text-secondary, #9da2b4)', maxWidth: '420px', margin: 0 }}>
        The page you're looking for doesn't exist, may have been moved, or the link might be
        broken.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '12px',
          backgroundColor: 'var(--accent, #e5a93b)',
          color: '#08090c',
          fontWeight: 700,
          padding: '10px 26px',
          borderRadius: '8px',
          textDecoration: 'none'
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
