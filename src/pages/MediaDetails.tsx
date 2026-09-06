import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieBySlug } from '../lib/movies';
import type { Movie } from '../types/movie';

export const MediaDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getMovieBySlug(slug).then((data) => {
        setMovie(data || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>;
  if (!movie) return <div style={{ color: '#fff', padding: '2rem' }}>Movie not found</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      {/* rest of your UI */}
    </div>
  );
};