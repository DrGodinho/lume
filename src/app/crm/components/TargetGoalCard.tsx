'use client';

interface TargetGoalCardProps {
  variant: 'compact' | 'full';
  targetGoal: number | null;
  targetPercent: number | null;
  editing: boolean;
  targetInput: string;
  onInputChange: (value: string) => void;
  onBeginEdit: () => void;
  onCommitEdit: () => void;
  onCancelEdit?: () => void;
  monthTotal?: number;
  formatMonthTotal?: (value: number) => string;
}

function formatGoalBRL(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR')}`;
}

/** Editor de meta único (dono da informação). Sidebar usa `compact`, dashboard usa `full`. */
export function TargetGoalCard({
  variant,
  targetGoal,
  targetPercent,
  editing,
  targetInput,
  onInputChange,
  onBeginEdit,
  onCommitEdit,
  onCancelEdit,
  monthTotal,
  formatMonthTotal,
}: TargetGoalCardProps) {
  const percentLabel = targetPercent !== null ? `${targetPercent}%` : '--';

  if (variant === 'compact') {
    if (editing) {
      return (
        <div className="rounded-xl border border-[#c9a227]/30 bg-[#03060b] p-3 shadow-[inset_0_0_0_1px_rgba(201,162,39,0.06)]">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-white/60">Faturamento Mensal</span>
            <span className="text-[#c9a227]">{percentLabel}</span>
          </div>
          <input
            type="number"
            value={targetInput}
            min={1}
            onChange={(event) => onInputChange(event.target.value)}
            onBlur={onCommitEdit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
              if (event.key === 'Escape') {
                onCancelEdit?.();
              }
            }}
            className="mt-3 w-full rounded-lg border border-[#c9a227]/35 bg-[#04080f] px-2.5 py-2 text-right text-sm font-bold text-white outline-none transition focus:border-[#f5d77a]/70"
            aria-label="Meta mensal do CRM"
            autoFocus
          />
          <p className="mt-2 text-right text-[10px] text-white/40">Enter salva a meta</p>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={onBeginEdit}
        className="w-full rounded-xl border border-white/10 bg-[#03060b] p-3 text-left transition hover:border-[#c9a227]/35 hover:bg-[#07111d]"
        title="Alterar meta mensal"
      >
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-white/60">Faturamento Mensal</span>
          <span className="text-[#c9a227]">{percentLabel}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#d4ad30] shadow-inner transition-all duration-1000"
            style={{ width: `${targetPercent ?? 0}%` }}
          />
        </div>
        <p className="mt-2 text-right text-[10px] text-white/40">
          {targetGoal !== null ? `Meta: ${formatGoalBRL(targetGoal)}` : 'Sem meta definida'}
        </p>
      </button>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
      <div>
        <h3 className="mb-1 font-display text-base font-bold uppercase tracking-wider text-white">Meta de Vendas</h3>
        <p className="text-xs text-white/50">Progresso mensal do consultor LUME</p>
      </div>

      {targetGoal === null ? (
        <div className="my-6 flex flex-col items-center gap-4 text-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-white/15">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Sem meta</span>
          </div>
          <p className="max-w-[200px] text-xs font-semibold text-white/55">
            Defina uma meta mensal para acompanhar seu progresso no dashboard.
          </p>
          <button
            type="button"
            onClick={onBeginEdit}
            className="rounded-2xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/20"
          >
            Definir meta
          </button>
        </div>
      ) : (
        <>
          <div className="my-6 flex flex-col items-center">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="absolute left-0 top-0 h-full w-full -rotate-90">
                <circle cx="64" cy="64" r="54" className="stroke-white/5" strokeWidth="8" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-[#c9a227]"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - (targetPercent ?? 0) / 100)}
                />
              </svg>
              <div className="text-center">
                <span className="text-3xl font-black text-white">{targetPercent ?? 0}%</span>
                <p className="text-[10px] font-semibold uppercase text-white/40">Metas</p>
              </div>
            </div>
            {monthTotal !== undefined && (
              <p className={`-mt-2 text-center text-xs font-bold ${targetGoal - monthTotal > 0 ? 'text-white/55' : 'text-emerald-300'}`}>
                {targetGoal - monthTotal > 0
                  ? `Faltam ${(formatMonthTotal ?? formatGoalBRL)(targetGoal - monthTotal)} para a meta`
                  : 'Meta alcançada'}
              </p>
            )}
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-semibold">
            {monthTotal !== undefined && (
              <div className="flex justify-between">
                <span className="text-white/40">Faturamento do mês:</span>
                <span className="text-white">{formatMonthTotal ? formatMonthTotal(monthTotal) : formatGoalBRL(monthTotal)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-white/40">Meta Estabelecida:</span>
              <span className="flex items-center gap-1.5 text-[#c9a227]">
                {editing ? (
                  <input
                    type="number"
                    value={targetInput}
                    placeholder="Ex: 10000"
                    onChange={(event) => onInputChange(event.target.value)}
                    onBlur={onCommitEdit}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.currentTarget.blur();
                      }
                      if (event.key === 'Escape') {
                        onCancelEdit?.();
                      }
                    }}
                    className="w-24 rounded-lg border border-[#c9a227]/40 bg-[#04080f] px-2 py-0.5 text-right text-xs text-white focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    {formatGoalBRL(targetGoal)}
                    <button type="button" onClick={onBeginEdit} className="text-white/30 transition hover:text-white/60" title="Editar meta">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </>
                )}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
