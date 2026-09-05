interface Env {
  OGADS_API_KEY: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const apiKey = context.env.OGADS_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server error: OGADS_API_KEY not configured in Cloudflare' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Cloudflare edge headers provide visitor IP and device details
  const clientIp = context.request.headers.get('cf-connecting-ip') || '';
  const userAgent = context.request.headers.get('user-agent') || '';

  try {
    const params = new URLSearchParams({
      ip: clientIp,
      user_agent: userAgent
    });

    const targetUrl = `https://appsave.store/api/v2?${params.toString()}`;

    const ogResponse = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!ogResponse.ok) {
      throw new Error(`OGAds responded with status: ${ogResponse.status}`);
    }

    const data: any = await ogResponse.json();

    if (!data.success) {
      throw new Error(data.error || 'OGAds API returned an unsuccessful response');
    }

    return new Response(JSON.stringify({ offers: data.offers }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch offers' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
