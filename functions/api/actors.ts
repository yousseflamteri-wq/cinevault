interface Env {
  TMDB_API_KEY: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

interface TmdbPerson {
  name: string;
  profile_path: string | null;
}

interface TmdbSearchResponse {
  results: TmdbPerson[];
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
  // Accept a comma-separated list of actor names, e.g. ?names=Tom Hanks,Emma Watson
  const namesParam = url.searchParams.get('names');

  if (!namesParam) {
    return new Response(JSON.stringify({ error: 'Missing "names" query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const names = namesParam
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, 10); // safety cap so one request can't trigger unlimited lookups

  try {
    // Look up each actor in parallel -- TMDB's search/person endpoint
    // is per-name, there's no batch endpoint, so we fan out and merge.
    const lookups = await Promise.all(
      names.map(async (name) => {
        const params = new URLSearchParams({
          api_key: apiKey,
          query: name
        });

        const res = await fetch(
          `https://api.themoviedb.org/3/search/person?${params.toString()}`
        );

        if (!res.ok) {
          return [name, null] as const;
        }

        const data = (await res.json()) as TmdbSearchResponse;
        const match = data.results?.[0];
        const profilePath = match?.profile_path ?? null;

        // TMDB's w185 size is a good balance of quality and file size
        // for small cast-list thumbnails.
        const photoUrl = profilePath
          ? `https://image.tmdb.org/t/p/w185${profilePath}`
          : null;

        return [name, photoUrl] as const;
      })
    );

    const photos: Record<string, string | null> = Object.fromEntries(lookups);

    return new Response(JSON.stringify({ photos }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Actor photos essentially never change -- cache at the edge for a month
        'Cache-Control': 'public, max-age=2592000'
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch actor photos' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
