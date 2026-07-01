'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type ToastTone = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  tone?: ToastTone;
  duration?: number;
  action?: ToastAction;
}

export interface ToastEntry {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
}

export interface ToastContextValue {
  toasts: ToastEntry[];
  push: (message: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
  clear: () => void;
}

const DEFAULT_DURATION_MS = 3000;
const MAX_VISIBLE_TOASTS = 3;
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const tone: ToastTone = options.tone ?? 'info';
      const duration = options.duration ?? (tone === 'error' ? 0 : DEFAULT_DURATION_MS);
      counterRef.current += 1;
      const id = counterRef.current;

      setToasts((current) => {
        const next = [...current, { id, message, tone, duration, action: options.action }];
        return next.length > MAX_VISIBLE_TOASTS ? next.slice(-MAX_VISIBLE_TOASTS) : next;
      });

      if (duration > 0) {
        const timer = setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  const clear = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, push, dismiss, clear }),
    [toasts, push, dismiss, clear],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>.');
  }
  return context;
}

interface ToastApi {
  success: (message: string, options?: Omit<ToastOptions, 'tone'>) => number;
  error: (message: string, options?: Omit<ToastOptions, 'tone'>) => number;
  warning: (message: string, options?: Omit<ToastOptions, 'tone'>) => number;
  info: (message: string, options?: Omit<ToastOptions, 'tone'>) => number;
}

export function useToastApi(): ToastApi {
  const { push } = useToast();
  return useMemo<ToastApi>(
    () => ({
      success: (message, options) => push(message, { ...options, tone: 'success' }),
      error: (message, options) => push(message, { ...options, tone: 'error' }),
      warning: (message, options) => push(message, { ...options, tone: 'warning' }),
      info: (message, options) => push(message, { ...options, tone: 'info' }),
    }),
    [push],
  );
}
