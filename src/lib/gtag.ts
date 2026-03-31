/**
 * Helper function to delay opening a URL until a gtag event is sent.
 * @param url The destination URL
 * @param eventName The conversion event name (default: conversion_event_contact)
 */
export function handleGtagClick(url: string, eventName: string = 'conversion_event_contact') {
  if (typeof (window as any).gtagSendEvent === 'function') {
    (window as any).gtagSendEvent(url);
  } else if (typeof (window as any).gtag === 'function') {
    // If the helper is not there but gtag is, we send the event manually
    (window as any).gtag('event', eventName, {
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
