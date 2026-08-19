'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logger } from '../../../lib/logger';

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
    const timeout = setTimeout(() => controller.abort(), 12000);

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

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
        setError(
          controller.signal.aborted
            ? 'A verificação de sessão demorou demais (o servidor pode estar compilando ou indisponível na rede local).'
            : 'Não foi possível verificar a sessão. Verifique se o notebook está acessível na rede.'
        );
        setIsAuthenticated(false);
        logger.error('[useAuthGuard] falha ao verificar /api/auth/me', err);
      } finally {
        clearTimeout(timeout);
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
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