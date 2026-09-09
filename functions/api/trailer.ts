interface Env {
  YOUTUBE_API_KEY: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const apiKey = context.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server error: YOUTUBE_API_KEY not configured in Cloudflare' }),
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
    // Build a search query that biases toward the official trailer
    const query = year ? `${title} ${year} official trailer` : `${title} official trailer`;

    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      videoEmbeddable: 'true',
      maxResults: '1',
      key: apiKey
    });

    const ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );

    if (!ytResponse.ok) {
      const errBody: any = await ytResponse.json().catch(() => ({}));
      throw new Error(
        errBody?.error?.message || `YouTube API responded with status ${ytResponse.status}`
      );
    }

    const data: any = await ytResponse.json();
    const videoId = data?.items?.[0]?.id?.videoId;

    if (!videoId) {
      return new Response(JSON.stringify({ trailerId: null }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Cache "not found" for a day too, so repeat visits don't keep re-searching
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    return new Response(JSON.stringify({ trailerId: videoId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache successful lookups at Cloudflare's edge for a week --
        // a movie's trailer essentially never changes, so this saves
        // quota on every repeat visitor without you doing anything.
        'Cache-Control': 'public, max-age=604800'
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch trailer' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
