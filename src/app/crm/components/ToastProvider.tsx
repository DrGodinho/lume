'use client';

import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react';
import { ToastProvider, useToast } from '../hooks/useToast';
import type { ToastTone } from '../hooks/useToast';

export { ToastProvider };

const TONE_STYLES: Record<ToastTone, { panel: string; icon: string; iconBg: string; text: string }> = {
  success: {
    panel: 'border-emerald-500/30 bg-emerald-500/10',
    icon: 'text-emerald-300',
    iconBg: 'bg-emerald-500/20',
    text: 'text-emerald-50',
  },
  error: {
    panel: 'border-red-500/30 bg-red-500/10',
    icon: 'text-red-300',
    iconBg: 'bg-red-500/20',
    text: 'text-red-50',
  },
  warning: {
    panel: 'border-[#c9a227]/30 bg-[#c9a227]/10',
    icon: 'text-[#f5d77a]',
    iconBg: 'bg-[#c9a227]/20',
    text: 'text-[#f5d77a]',
  },
  info: {
    panel: 'border-white/15 bg-[#07111d]/95',
    icon: 'text-white/70',
    iconBg: 'bg-white/10',
    text: 'text-white',
  },
};

const TONE_ICON: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(calc(100vw-2rem),360px)] flex-col gap-2 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => {
        const styles = TONE_STYLES[toast.tone];
        const Icon = TONE_ICON[toast.tone];
        return (
          <div
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-200 ${styles.panel} ${styles.text}`}
          >
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${styles.iconBg}`}>
              <Icon className={`h-4 w-4 ${styles.icon}`} strokeWidth={2.5} />
            </span>
            <p className="flex-1 break-words leading-snug">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  dismiss(toast.id);
                }}
                className="rounded-md px-2 py-1 text-xs font-black uppercase tracking-wider underline-offset-2 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-md p-1 text-current/60 transition hover:text-current"
              aria-label="Fechar notificação"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
