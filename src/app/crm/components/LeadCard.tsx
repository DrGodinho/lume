'use client';

import { format } from 'date-fns';
import type { DragEvent } from 'react';
import type { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  collapsed: boolean;
  daysInStatus: (lead: Lead) => number;
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  onToggleCollapse: (leadId: string) => void;
  onOpenDetail: (lead: Lead) => void;
  onOpenEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  disableMoveLeft: boolean;
  disableMoveRight: boolean;
}

export function LeadCard({
  lead,
  collapsed,
  daysInStatus,
  formatCurrency,
  getLeadServiceDate,
  onToggleCollapse,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragEnd,
  disableMoveLeft,
  disableMoveRight,
}: LeadCardProps) {
  const serviceDate = getLeadServiceDate(lead);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={() => onOpenEdit(lead)}
      title="Duplo clique para editar este lead"
      className="group relative rounded-2xl border border-white/5 bg-[#04080f]/90 p-3 shadow-md transition hover:border-[#c9a227]/30 md:p-2.5 md:cursor-grab md:active:cursor-grabbing"
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleCollapse(lead.id);
          }}
          onDoubleClick={(event) => event.stopPropagation()}
          className="shrink-0 text-white/30 transition hover:text-white/60"
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          <svg className={`h-3 w-3 transition ${collapsed ? '' : 'rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetail(lead);
          }}
          onDoubleClick={(event) => {
            event.stopPropagation();
            onOpenEdit(lead);
          }}
          className="min-w-0 flex-1 text-left"
        >
          <h4 className="truncate border-b border-dotted border-white/20 text-xs font-bold text-white transition hover:border-[#c9a227]/60">{lead.name}</h4>
        </button>
      </div>

      {collapsed ? (
        <div className="mt-1.5 flex items-center justify-between">
          <span className="truncate text-xs text-white/50">{lead.phone}</span>
          <span className="shrink-0 text-xs font-black text-[#c9a227]">R$ {formatCurrency(lead.value)}</span>
        </div>
      ) : (
        <>
          <p className="mt-1 text-[11px] text-white/40">{lead.phone}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/40">
            <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {lead.sqm.toFixed(2)} m²
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#c9a227]/70">
            <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <circle cx="12" cy="12" r="1.5" />
            </svg>
            {lead.neighborhood}
          </p>
          {serviceDate && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-sky-300/80">
              <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Serviço {format(serviceDate, 'dd/MM')}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-1.5">
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white/60">{lead.filmType}</span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-white/30">{daysInStatus(lead)}d</span>
              <span className="text-xs font-black text-[#c9a227]">R$ {formatCurrency(lead.value)}</span>
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-white/5 pt-1.5 opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
            <button
              type="button"
              disabled={disableMoveLeft}
              onClick={(event) => {
                event.stopPropagation();
                onMoveLeft();
              }}
              onDoubleClick={(event) => event.stopPropagation()}
              className="rounded bg-white/5 p-0.5 text-[11px] leading-none text-white/50 disabled:opacity-20 hover:text-[#c9a227]"
              title="Mover para esquerda"
            >
              &larr;
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenEdit(lead);
                }}
                onDoubleClick={(event) => event.stopPropagation()}
                className="text-white/40 hover:text-white"
                title="Editar"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(lead.id);
                }}
                onDoubleClick={(event) => event.stopPropagation()}
                className="text-white/30 hover:text-red-400"
                title="Excluir"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              disabled={disableMoveRight}
              onClick={(event) => {
                event.stopPropagation();
                onMoveRight();
              }}
              onDoubleClick={(event) => event.stopPropagation()}
              className="rounded bg-white/5 p-0.5 text-[11px] leading-none text-white/50 disabled:opacity-20 hover:text-[#c9a227]"
              title="Mover para direita"
            >
              &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
