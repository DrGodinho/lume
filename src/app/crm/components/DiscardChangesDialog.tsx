'use client';

import { AlertTriangle } from 'lucide-react';

interface DiscardChangesDialogProps {
  open: boolean;
  leadName?: string | null;
  isCreating: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DiscardChangesDialog({
  open,
  leadName,
  isCreating,
  onCancel,
  onConfirm,
}: DiscardChangesDialogProps) {
  if (!open) return null;

  const description = isCreating
    ? 'O novo lead não será criado. As informações preenchidas serão perdidas.'
    : leadName
      ? `As alterações em "${leadName}" serão perdidas e o lead voltará ao estado original.`
      : 'As alterações não salvas neste lead serão perdidas.';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="discard-changes-title"
        aria-describedby="discard-changes-description"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 id="discard-changes-title" className="font-display text-base font-black tracking-tight text-white">
              Descartar alterações?
            </h3>
            <p id="discard-changes-description" className="mt-1 text-sm text-white/60">
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
            Continuar editando
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl border border-red-400/30 bg-red-500/15 py-2.5 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
          >
            Descartar e sair
          </button>
        </div>
      </div>
    </div>
  );
}
