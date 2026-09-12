interface D1Result {
  results?: unknown[];
}

interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1Result>;
  all: () => Promise<D1Result>;
}

interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
}

interface Env {
  DB: D1Database;
}

interface EventContext {
  request: Request;
  env: Env;
}

const VALID_EVENT_TYPES = new Set(['watch_now', 'trailer', 'add_to_list', 'pageview']);

// POST /api/track -- record a single click/interaction event.
// Body: { "eventType": "watch_now" | "trailer" | "add_to_list" | "pageview", "movieSlug": "inception" }
export const onRequestPost = async (context: EventContext): Promise<Response> => {
  try {
    const body: any = await context.request.json();
    const eventType = body?.eventType;
    const movieSlug = body?.movieSlug ?? null;

    if (!VALID_EVENT_TYPES.has(eventType)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing eventType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await context.env.DB.prepare(
      'INSERT INTO events (event_type, movie_slug) VALUES (?, ?)'
    )
      .bind(eventType, movieSlug)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    // Tracking should never break the user's experience -- fail quietly
    // with a 200 so the frontend doesn't need special-case error handling
    // for what is, at worst, a missed analytics beacon.
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET /api/track?key=YOUR_SECRET -- view aggregated stats.
// Protected by a simple shared-secret query param so random visitors
// can't see your click data, without needing a full auth system.
export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const url = new URL(context.request.url);
  const providedKey = url.searchParams.get('key');
  const expectedKey = (context.env as unknown as { STATS_KEY?: string }).STATS_KEY;

  if (!expectedKey || providedKey !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const byMovie = await context.env.DB.prepare(
      `SELECT movie_slug, event_type, COUNT(*) as count
       FROM events
       WHERE movie_slug IS NOT NULL
       GROUP BY movie_slug, event_type
       ORDER BY count DESC
       LIMIT 100`
    ).all();

    const totals = await context.env.DB.prepare(
      `SELECT event_type, COUNT(*) as count
       FROM events
       GROUP BY event_type`
    ).all();

    return new Response(
      JSON.stringify({
        byMovie: byMovie.results ?? [],
        totals: totals.results ?? []
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
