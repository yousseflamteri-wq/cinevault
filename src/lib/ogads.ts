export interface OgadsOffer {
  offerid: number | string;
  name: string;
  description: string;
  link: string;
  picture: string;
  adcopy?: string;
}

export async function fetchOgadsOffers(): Promise<OgadsOffer[]> {
  try {
    const response = await fetch('/api/offers');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data.offers)) return data.offers;
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.warn('Local preview: /api/offers only runs on Cloudflare. Showing test offers.');
    // Demo fallback for local testing before deploying to Cloudflare
    return [
      {
        offerid: 1,
        name: 'Opera GX Gaming Browser',
        description: 'Download and open to verify your session.',
        link: 'https://google.com',
        picture: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
        adcopy: 'Free Install'
      },
      {
        offerid: 2,
        name: 'Quick Opinion Survey',
        description: 'Answer 3 quick questions to unlock playback.',
        link: 'https://google.com',
        picture: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=120&q=80',
        adcopy: 'Survey'
      }
    ];
  }
}