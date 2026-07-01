'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToastApi } from './useToast';

export interface UseLogoutResult {
  isLoggingOut: boolean;
  logout: () => Promise<void>;
}

export function useLogout(redirectTo: string = '/login'): UseLogoutResult {
  const toast = useToastApi();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    let supabaseError: unknown = null;
    let apiError: unknown = null;

    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        supabaseError = error;
      }
    }

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      apiError = error;
    }

    if (supabaseError || apiError) {
      const detail =
        (supabaseError instanceof Error && supabaseError.message) ||
        (apiError instanceof Error && apiError.message) ||
        'Erro desconhecido ao encerrar a sessão.';
      toast.error(`Não foi possível sair. ${detail}`);
      setIsLoggingOut(false);
      return;
    }

    toast.success('Sessão encerrada.');
    window.location.href = redirectTo;
  }, [isLoggingOut, redirectTo, toast]);

  return { isLoggingOut, logout };
}
