import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getAllMedia } from './lib/movies';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/hero/Hero';
import { MovieRow } from './components/movie/MovieRow';
import { GenreFilter } from './components/movie/GenreFilter';
import { MediaDetails } from './pages/MediaDetails';

const GENRES = [
  'All',
  'Sci-Fi',
  'Action',
  'Adventure',
  'Drama',
  'Crime',
  'Romance',
  'War',
  'Thriller',
  'Animation'
];

function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const allMedia = getAllMedia();

  // Filter movies when a specific genre is selected
  const filteredMedia = selectedGenre === 'All'
    ? allMedia
    : allMedia.filter(m =>
        m.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
      );

  const heroMovies = allMedia.slice(0, 10);
  const topRated = [...filteredMedia].sort((a, b) => b.rating - a.rating);

  return (
    <div>
      {/* Auto-sliding Hero */}
      <Hero items={heroMovies} />

      {/* Filter bar placed directly between Hero and Movie Rows */}
      <div style={{ marginTop: '-24px', position: 'relative', zIndex: 10 }}>
        <GenreFilter
          genres={GENRES}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        {selectedGenre === 'All' ? (
          <>
            <MovieRow
              title="Trending Movies"
              items={allMedia}
              subtitle="Popular titles compiled from Git records"
            />
            <MovieRow
              title="Highest Rated"
              items={[...allMedia].sort((a, b) => b.rating - a.rating)}
              subtitle="Critically acclaimed cinema"
            />
            <MovieRow
              title="Sci-Fi Explorations"
              items={allMedia.filter(m => m.genres.includes('Sci-Fi'))}
              subtitle="Space and mind-bending narratives"
            />
          </>
        ) : (
          <>
            {filteredMedia.length > 0 ? (
              <>
                <MovieRow
                  title={`${selectedGenre} Movies`}
                  items={filteredMedia}
                  subtitle={`Showing all ${filteredMedia.length} matching titles`}
                />
                {filteredMedia.length >= 3 && (
                  <MovieRow
                    title={`Top Rated in ${selectedGenre}`}
                    items={topRated}
                    subtitle="Ranked by audience score"
                  />
                )}
              </>
            ) : (
              <div
                className="site-container"
                style={{
                  padding: '60px 0',
                  textAlign: 'center',
                  color: 'var(--text-muted, #717686)'
                }}
              >
                <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                  No titles found under <strong>{selectedGenre}</strong> yet.
                </p>
                <button
                  onClick={() => setSelectedGenre('All')}
                  style={{
                    backgroundColor: 'var(--accent, #e5a93b)',
                    color: '#08090c',
                    fontWeight: 700,
                    padding: '8px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '12px'
                  }}
                >
                  View All Movies
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas, #08090c)', paddingBottom: '80px' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:slug" element={<MediaDetails />} />
      </Routes>
    </div>
  );
}

export default App;