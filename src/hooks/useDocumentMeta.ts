import { useEffect } from 'react';

interface DocumentMetaOptions {
  title: string;
  description?: string;
  image?: string;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Updates the tab title and Open Graph/Twitter meta tags for the current
// page. Restores the site-wide defaults on unmount, so navigating away
// (e.g. back to Home) doesn't leave a stale movie title/description behind.
export function useDocumentMeta({ title, description, image }: DocumentMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    setMetaTag('property', 'og:title', title);
    setMetaTag('name', 'twitter:title', title);

    if (image) {
      setMetaTag('property', 'og:image', image);
      setMetaTag('name', 'twitter:image', image);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, image]);
}
