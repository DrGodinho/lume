'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

interface MultiSelectDropdownProps {
  label: string;
  options: readonly string[];
  selected: readonly string[];
  onChange: (selected: string[]) => void;
  emptyLabel?: string;
  className?: string;
  testId?: string;
}

export function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  emptyLabel = 'Todos',
  className = '',
  testId,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleClear = () => onChange([]);

  const summary = selected.length === 0
    ? emptyLabel
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selecionados`;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        data-testid={testId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border bg-[#04080f] px-3 py-3 text-sm transition sm:px-4 ${
          selected.length > 0
            ? 'border-[#c9a227]/40 text-white shadow-[inset_0_0_0_1px_rgba(201,162,39,0.08)]'
            : 'border-white/5 text-white/70'
        } hover:border-[#c9a227]/40 focus:border-[#c9a227]/40 focus:outline-none`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-semibold">{label}</span>
          {selected.length > 0 && (
            <span className="rounded-full bg-[#c9a227] px-1.5 text-[10px] font-black text-[#04080f]">
              {selected.length}
            </span>
          )}
          {selected.length === 1 && (
            <span className="truncate text-white/50">: {selected[0]}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-[#07111d] p-2 shadow-2xl sm:right-auto sm:min-w-[16rem]"
        >
          {selected.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-white/5"
            >
              <X className="h-3.5 w-3.5" />
              Limpar seleção
            </button>
          )}
          <ul id={listboxId} role="listbox" aria-multiselectable="true" className="space-y-0.5">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleOption(option)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? 'bg-[#c9a227]/10 text-[#f5d77a]'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        isSelected
                          ? 'border-[#c9a227] bg-[#c9a227] text-[#04080f]'
                          : 'border-white/15 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="truncate">{option}</span>
                  </button>
                </li>
              );
            })}
            {options.length === 0 && (
              <li className="px-3 py-2 text-xs text-white/40">Nenhuma opção disponível.</li>
            )}
          </ul>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {summary}
      </span>
    </div>
  );
}
