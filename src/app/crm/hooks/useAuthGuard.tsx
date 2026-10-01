'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logger } from '../../../lib/logger';
import { fetchWithTimeout, isAbortError } from '@/lib/fetchWithTimeout';

interface UseAuthGuardReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useAuthGuard(): UseAuthGuardReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const response = await fetchWithTimeout(
          '/api/auth/me',
          {
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          },
          25000 // 25s timeout (evita falsos-positivos durante compilação do Next.js)
        );

        if (cancelled) return;

        if (response.ok) {
          setIsAuthenticated(true);
          setError(null);
        } else {
          setIsAuthenticated(false);
          setError(null);
          const loginUrl = new URL('/login', window.location.origin);
          loginUrl.searchParams.set('redirectTo', pathname);
          router.replace(loginUrl.toString());
        }
      } catch (err) {
        if (cancelled) return;

        const isTimeoutOrAbort = isAbortError(err) || controller.signal.aborted;

        if (isTimeoutOrAbort) {
          if (cancelled) return;

          logger.warn('[useAuthGuard] timeout ao verificar /api/auth/me (servidor compilando ou lento)');
          setError(
            'A verificação de sessão demorou muito para responder (o servidor pode estar compilando rotas). Tente novamente.'
          );
        } else {
          logger.error('[useAuthGuard] falha ao verificar /api/auth/me', err);
          setError('Não foi possível verificar a sessão. Verifique se o servidor está acessível.');
        }

        setIsAuthenticated(false);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
      controller.abort(new DOMException('useAuthGuard desmontado', 'AbortError'));
    };
  }, [router, pathname, attempt]);

  return {
    isAuthenticated,
    isLoading,
    error,
    retry: () => {
      setError(null);
      setIsLoading(true);
      setAttempt((value) => value + 1);
    },
  };
}

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, error, retry } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#040811] flex items-center justify-center">
        <div className="text-[#c9a227] animate-pulse font-montserrat font-bold tracking-widest uppercase">
          Carregando...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#040811] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="max-w-md text-sm leading-relaxed text-red-300">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-lg border border-[#c9a227]/40 bg-[#c9a227]/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#c9a227] transition hover:bg-[#c9a227]/20"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ?? null;
  }

  return <>{children}</>;
}