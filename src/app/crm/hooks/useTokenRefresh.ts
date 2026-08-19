'use client';

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { useEffect } from 'react';

let refreshPromise: Promise<boolean> | null = null;
let activeConsumers = 0;
let patchedFetch: ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) | null = null;
let originalFetch: ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) | null = null;

export function useTokenRefresh() {
  useEffect(() => {
    const refreshAccessToken = async (): Promise<boolean> => {
      if (refreshPromise) return refreshPromise;

      refreshPromise = (async () => {
        try {
          const response = await fetchWithTimeout('/api/auth/refresh', {
            method: 'POST',
            credentials: 'same-origin',
          });

          if (response.ok) {
            return true;
          }
          return false;
        } catch {
          return false;
        } finally {
          refreshPromise = null;
        }
      })();

      return refreshPromise;
    };

    const isSupabaseRequest = (url: string) => url.includes('supabase.co');

    const handleApiError = async (response: Response, url: string) => {
      if (response.status === 401 && !isSupabaseRequest(url)) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return 'retry';
        }
        const loginUrl = new URL('/login', window.location.origin);
        loginUrl.searchParams.set('redirectTo', window.location.pathname);
        window.location.href = loginUrl.toString();
      }
      return 'error';
    };

    const installInterceptor = () => {
      if (patchedFetch) {
        activeConsumers += 1;
        return;
      }
      originalFetch = window.fetch.bind(window);
      patchedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
        const response = await originalFetch!(input, init);
        if (response.status === 401) {
          const result = await handleApiError(response, url);
          if (result === 'retry') {
            return originalFetch!(input, init);
          }
        }
        return response;
      };
      window.fetch = patchedFetch;
      activeConsumers = 1;
    };

    const uninstallInterceptor = () => {
      activeConsumers -= 1;
      if (activeConsumers <= 0 && patchedFetch) {
        if (originalFetch) window.fetch = originalFetch;
        patchedFetch = null;
        originalFetch = null;
        activeConsumers = 0;
      }
    };

    installInterceptor();
    return () => {
      uninstallInterceptor();
    };
  }, []);
}