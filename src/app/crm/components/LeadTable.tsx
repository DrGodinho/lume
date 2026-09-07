'use client';

import { format } from 'date-fns';
import { formatBRL } from '../utils';
import { getLeadStatusClasses } from '../hooks/useAgenda';
import type { Lead, LeadSortKey } from '../types';

interface LeadTableBaseProps {
  leads: Lead[];
  emptyMessage: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  tableClassName?: string;
}

export type LeadTableProps = LeadTableBaseProps &
  (
    | { compact: true; onOpenLead: (lead: Lead) => void }
    | {
        compact?: false;
        onOpenEdit: (lead: Lead) => void;
        onRowClick: (lead: Lead) => void;
        onRowDoubleClick: (lead: Lead) => void;
        onDelete: (leadId: string) => void;
        sortKey: LeadSortKey;
        sortDir: 'asc' | 'desc';
        onToggleSort: (key: LeadSortKey) => void;
        daysInStatus: (lead: Lead) => number;
        getLeadServiceDate: (lead: Lead) => Date | null;
      }
  );

function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortDir,
  onToggleSort,
  align = 'left',
}: {
  label: string;
  sortKey: LeadSortKey;
  activeSortKey: LeadSortKey;
  sortDir: 'asc' | 'desc';
  onToggleSort: (key: LeadSortKey) => void;
  align?: 'left' | 'center' | 'right';
}) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';
  return (
    <th className={`cursor-pointer select-none pb-3 font-semibold hover:text-white ${alignClass}`} onClick={() => onToggleSort(sortKey)}>
      {label} {activeSortKey === sortKey && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

/** Tabela de leads compartilhada (Kanban desktop + Recentes do dashboard).
 * `compact` = 5 colunas sem ordenação; completo = 9 colunas com ordenação e ações. */
export function LeadTable(props: LeadTableProps) {
  const {
    leads,
    emptyMessage,
    emptyActionLabel,
    onEmptyAction,
    tableClassName = 'w-full border-collapse text-left text-sm text-white/80',
  } = props;
  const compact = props.compact === true;

  return (
    <table className={tableClassName}>
      <thead>
        <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
          {props.compact === true ? (
            <>
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold">Bairro</th>
              <th className="pb-3 font-semibold">Película</th>
              <th className="pb-3 font-semibold">Valor</th>
              <th className="pb-3 font-semibold">Status</th>
            </>
          ) : (
            <>
              <SortableHeader label="Cliente" sortKey="name" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} />
              <SortableHeader label="Bairro" sortKey="neighborhood" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} />
              <SortableHeader label="Película" sortKey="filmType" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} />
              <SortableHeader label="Área (m²)" sortKey="sqm" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} align="center" />
              <SortableHeader label="Valor" sortKey="value" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} align="right" />
              <SortableHeader label="Status" sortKey="status" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} align="center" />
              <SortableHeader label="Serviço" sortKey="dataServico" activeSortKey={props.sortKey} sortDir={props.sortDir} onToggleSort={props.onToggleSort} align="center" />
              <th className="pb-3 text-center font-semibold">Dias</th>
              <th className="pb-3 text-right font-semibold">Ações</th>
            </>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {leads.map((lead) => (
          <tr
            key={lead.id}
            className={compact ? 'cursor-pointer hover:bg-white/[0.01]' : 'group cursor-pointer hover:bg-white/[0.01]'}
            onClick={() => (props.compact === true ? props.onOpenLead(lead) : props.onRowClick(lead))}
            {...(props.compact === true
              ? {}
              : {
                  onDoubleClick: () => props.onRowDoubleClick(lead),
                  title: 'Clique para ver detalhes. Duplo clique para editar.',
                })}
          >
            <td className="py-3.5 font-semibold text-white">
              <div className="flex flex-col">
                <span className="border-b border-dotted border-white/20 transition hover:border-[#c9a227]/60">{lead.name}</span>
                <span className="text-xs font-normal text-white/40">{lead.phone}</span>
              </div>
            </td>
            <td className="py-3.5 text-white/70">{lead.neighborhood}</td>
            <td className="py-3.5">
              <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2 py-0.5 text-xs text-white/70">
                {lead.filmType}
              </span>
            </td>
            {props.compact !== true && (
              <td className="py-3.5 text-center font-mono">{lead.sqm.toFixed(2)}m²</td>
            )}
            <td className={`py-3.5 font-bold text-[#c9a227] ${compact ? '' : 'text-right'}`}>
              {formatBRL(lead.value)}
            </td>
            <td className={`py-3.5 ${compact ? '' : 'text-center'}`}>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>
                {lead.status}
              </span>
            </td>
            {props.compact !== true && (
              <>
                <td className="py-3.5 text-center text-xs font-semibold text-sky-300">
                  {props.getLeadServiceDate(lead) ? format(props.getLeadServiceDate(lead)!, 'dd/MM/yyyy') : '—'}
                </td>
                <td className="py-3.5 text-center font-mono text-xs text-white/40">{props.daysInStatus(lead)}d</td>
                <td className="py-3.5 text-right">
                  <div className="flex justify-end gap-3 opacity-60 transition duration-300 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onOpenEdit(lead);
                      }}
                      onDoubleClick={(event) => event.stopPropagation()}
                      className="text-white/40 hover:text-white"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onDelete(lead.id);
                      }}
                      onDoubleClick={(event) => event.stopPropagation()}
                      className="text-white/30 hover:text-red-400"
                      title="Excluir"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}
        {leads.length === 0 && (
          <tr>
            <td colSpan={compact ? 5 : 9} className="py-8">
              <LeadTableEmptyBody message={emptyMessage} actionLabel={emptyActionLabel} onAction={onEmptyAction} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function LeadTableEmptyBody({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="font-semibold text-white/40">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/15"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Empty state em caixa (listas mobile fora de tabela). */
export function LeadTableEmpty({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
      <p className="text-sm font-semibold text-white/30">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/15"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
