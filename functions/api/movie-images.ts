interface Env {
  TMDB_API_KEY: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

interface TmdbMovie {
  title: string;
  release_date: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface TmdbSearchResponse {
  results: TmdbMovie[];
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const apiKey = context.env.TMDB_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server error: TMDB_API_KEY not configured in Cloudflare' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const url = new URL(context.request.url);
  const title = url.searchParams.get('title');
  const year = url.searchParams.get('year');

  if (!title) {
    return new Response(JSON.stringify({ error: 'Missing "title" query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      query: title
    });
    if (year) params.set('year', year);

    const res = await fetch(`https://api.themoviedb.org/3/search/movie?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`TMDB API responded with status ${res.status}`);
    }

    const data = (await res.json()) as TmdbSearchResponse;
    const match = data.results?.[0];

    const poster = match?.poster_path
      ? `https://image.tmdb.org/t/p/w500${match.poster_path}`
      : null;
    const backdrop = match?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${match.backdrop_path}`
      : null;

    return new Response(JSON.stringify({ poster, backdrop }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Movie artwork essentially never changes -- cache at the edge for a month
        'Cache-Control': 'public, max-age=2592000'
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch movie images' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
