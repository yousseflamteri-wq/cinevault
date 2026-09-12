export type TrackEventType = 'watch_now' | 'trailer' | 'add_to_list' | 'pageview';

// Fire-and-forget event tracking. Never throws and never blocks the UI --
// a failed analytics beacon should never be visible to the user or delay
// the action they just took (opening a modal, etc).
export function trackEvent(eventType: TrackEventType, movieSlug?: string) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, movieSlug: movieSlug ?? null }),
      keepalive: true
    }).catch(() => {
      // Ignore network errors -- tracking is best-effort
    });
  } catch {
    // Ignore synchronous errors too (e.g. JSON.stringify on bad input)
  }
}
