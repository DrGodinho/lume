'use client';

import { AlertTriangle } from 'lucide-react';

type Tone = 'amber' | 'red' | 'gold';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  onCancel: () => void;
  onConfirm: () => void;
}

const TONE_ICON_CLASSES: Record<Tone, string> = {
  amber: 'bg-amber-500/15 text-amber-300',
  red: 'bg-red-500/15 text-red-300',
  gold: 'bg-[#c9a227]/15 text-[#f5d77a]',
};

const TONE_CONFIRM_CLASSES: Record<Tone, string> = {
  amber: 'border-amber-400/30 bg-amber-500/15 text-amber-200 hover:bg-amber-500/20',
  red: 'border-red-400/30 bg-red-500/15 text-red-200 hover:bg-red-500/20',
  gold: 'border-[#c9a227]/30 bg-[#c9a227]/15 text-[#f5d77a] hover:bg-[#c9a227]/20',
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'amber',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${TONE_ICON_CLASSES[tone]}`}>
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 id="confirm-dialog-title" className="font-display text-base font-black tracking-tight text-white">
              {title}
            </h3>
            <p id="confirm-dialog-description" className="mt-1 text-sm text-white/60">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-white/5 bg-white/[0.01] py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-2xl border py-2.5 text-sm font-bold transition ${TONE_CONFIRM_CLASSES[tone]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
