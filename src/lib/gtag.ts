declare global {
  interface Window {
    gtagSendEvent?: (url: string) => void;
    gtag?: (command: string, eventName?: string, params?: Record<string, unknown>) => void;
  }
}

/**
 * Helper function to delay opening a URL until a gtag event is sent.
 * @param url The destination URL
 * @param eventName The conversion event name (default: conversion_event_contact)
 */
export function handleGtagClick(url: string, eventName: string = 'conversion_event_contact') {
  if (typeof window.gtagSendEvent === 'function') {
    window.gtagSendEvent(url);
  } else if (typeof window.gtag === 'function') {
    // If the helper is not there but gtag is, we send the event manually
    window.gtag('event', eventName, {
      'event_callback': () => {
        window.location.href = url;
      },
      'event_timeout': 2000
    });
  } else {
    // Fallback if gtag is not available
    window.location.href = url;
  }
}
