'use client';

import { useEffect } from 'react';

const DEFAULT_CONVERSION_EVENT = 'conversion_event_contact';
const WHATSAPP_HOSTS = new Set(['wa.me', 'api.whatsapp.com', 'web.whatsapp.com']);

type GtagWindow = Window & {
  gtag?: (command: 'event', eventName: string, params?: Record<string, unknown>) => void;
};

function isConversionHref(href: string) {
  if (href.startsWith('tel:')) return true;

  try {
    const url = new URL(href, window.location.href);
    return WHATSAPP_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function sendConversionEvent(eventName: string) {
  const { gtag } = window as GtagWindow;

  if (typeof gtag !== 'function') return;

  gtag('event', eventName, {
    transport_type: 'beacon',
  });
}

export function GoogleConversionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link || !isConversionHref(link.href)) return;

      sendConversionEvent(link.dataset.googleConversionEvent || DEFAULT_CONVERSION_EVENT);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
