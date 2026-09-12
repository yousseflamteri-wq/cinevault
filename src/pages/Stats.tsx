import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface MovieEventRow {
  movie_slug: string;
  event_type: string;
  count: number;
}

interface TotalRow {
  event_type: string;
  count: number;
}

export function Stats() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get('key') ?? '';
  const [byMovie, setByMovie] = useState<MovieEventRow[]>([]);
  const [totals, setTotals] = useState<TotalRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key) {
      setError('Missing ?key= in the URL.');
      setLoading(false);
      return;
    }

    fetch(`/api/track?key=${encodeURIComponent(key)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
      })
      .then((data: { byMovie: MovieEventRow[]; totals: TotalRow[] }) => {
        setByMovie(data.byMovie);
        setTotals(data.totals);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  // Group per-movie rows by slug so each movie shows all its event types together
  const grouped = byMovie.reduce<Record<string, Record<string, number>>>((acc, row) => {
    acc[row.movie_slug] = acc[row.movie_slug] || {};
    acc[row.movie_slug][row.event_type] = row.count;
    return acc;
  }, {});

  const sortedSlugs = Object.keys(grouped).sort((a, b) => {
    const totalA = Object.values(grouped[a]).reduce((s, n) => s + n, 0);
    const totalB = Object.values(grouped[b]).reduce((s, n) => s + n, 0);
    return totalB - totalA;
  });

  return (
    <div style={{ padding: '100px 24px 60px', maxWidth: '900px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>CineVault Stats</h1>

      {loading && <p style={{ color: '#9da2b4' }}>Loading...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {!loading && !error && (
        <>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>Totals</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {totals.map((t) => (
              <div
                key={t.event_type}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  minWidth: '120px'
                }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.count}</div>
                <div style={{ fontSize: '0.8rem', color: '#9da2b4' }}>{t.event_type}</div>
              </div>
            ))}
            {totals.length === 0 && <p style={{ color: '#717686' }}>No events recorded yet.</p>}
          </div>

          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>By Movie</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#9da2b4', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '8px 0' }}>Movie</th>
                <th style={{ padding: '8px 12px' }}>Views</th>
                <th style={{ padding: '8px 12px' }}>Watch Now</th>
                <th style={{ padding: '8px 12px' }}>Trailer</th>
                <th style={{ padding: '8px 12px' }}>Added to List</th>
              </tr>
            </thead>
            <tbody>
              {sortedSlugs.map((slug) => (
                <tr key={slug} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0' }}>{slug}</td>
                  <td style={{ padding: '8px 12px' }}>{grouped[slug].pageview ?? 0}</td>
                  <td style={{ padding: '8px 12px' }}>{grouped[slug].watch_now ?? 0}</td>
                  <td style={{ padding: '8px 12px' }}>{grouped[slug].trailer ?? 0}</td>
                  <td style={{ padding: '8px 12px' }}>{grouped[slug].add_to_list ?? 0}</td>
                </tr>
              ))}
              {sortedSlugs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '16px 0', color: '#717686' }}>
                    No per-movie events yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
