'use client';

import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { LEAD_STAGES } from '../constants';
import type { LeadStatus } from '../constants/stages';
import { resolveKanbanDrop, type KanbanDragData } from '../utils/kanbanDnd';
import { LeadCard } from './LeadCard';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { SortableLeadCard } from './SortableLeadCard';
import type { Lead, LeadSortKey, LeadSyncStatus } from '../types';

interface KanbanBoardProps {
  leads: Lead[];
  filteredLeads: Lead[];
  sortedFilteredLeads: Lead[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterNeighborhood: string[];
  setFilterNeighborhood: (value: string[]) => void;
  filterStatus: LeadStatus[];
  setFilterStatus: (value: LeadStatus[]) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  neighborhoods: readonly string[];
  viewMode: 'kanban' | 'table';
  setViewMode: (mode: 'kanban' | 'table') => void;
  collapsedCards: Set<string>;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onToggleCollapse: (leadId: string) => void;
  onOpenCreateModal: () => void;
  onOpenDetail: (lead: Lead) => void;
  onOpenEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onTogglePin: (leadId: string) => void;
  onStatusChange: (leadId: string, status: Lead['status']) => void;
  onReorderLead: (activeLeadId: string, overLeadId: string) => void;
  onTableRowClick: (lead: Lead) => void;
  onTableRowDoubleClick: (lead: Lead) => void;
  sortKey: LeadSortKey;
  sortDir: 'asc' | 'desc';
  onToggleSort: (key: LeadSortKey) => void;
  daysInStatus: (lead: Lead) => number;
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadStatusClasses: (status: Lead['status']) => string;
  leadSyncState: Record<string, LeadSyncStatus>;
}

const STATUS_OPTIONS = LEAD_STAGES as unknown as readonly LeadStatus[];

export function KanbanBoard({
  leads,
  filteredLeads,
  sortedFilteredLeads,
  searchQuery,
  setSearchQuery,
  filterNeighborhood,
  setFilterNeighborhood,
  filterStatus,
  setFilterStatus,
  hasActiveFilters,
  onClearFilters,
  neighborhoods,
  viewMode,
  setViewMode,
  collapsedCards,
  onCollapseAll,
  onExpandAll,
  onToggleCollapse,
  onOpenCreateModal,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onTogglePin,
  onStatusChange,
  onReorderLead,
  onTableRowClick,
  onTableRowDoubleClick,
  sortKey,
  sortDir,
  onToggleSort,
  daysInStatus,
  formatCurrency,
  getLeadServiceDate,
  getLeadStatusClasses,
  leadSyncState,
}: KanbanBoardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#07111d]/50 p-4 shadow-lg backdrop-blur-md sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar por nome, telefone, observações..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#c9a227]/40 focus:outline-none focus:ring-1 focus:ring-[#c9a227]/40"
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 lg:w-auto">
          <MultiSelectDropdown
            className="col-span-1"
            label="Bairro"
            emptyLabel="Todos os Bairros"
            options={neighborhoods}
            selected={filterNeighborhood}
            onChange={setFilterNeighborhood}
            testId="filter-neighborhood"
          />

          <MultiSelectDropdown
            className="col-span-1"
            label="Status"
            emptyLabel="Todos os Status"
            options={STATUS_OPTIONS}
            selected={filterStatus}
            onChange={(value) => setFilterStatus(value as LeadStatus[])}
            testId="filter-status"
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-3 text-xs font-semibold text-white/70 transition hover:border-red-400/30 hover:text-red-200 sm:col-span-1 sm:px-4"
              title="Limpar todos os filtros e busca"
            >
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </button>
          )}

          <div className="col-span-2 flex rounded-2xl border border-white/5 bg-[#04080f] p-1 sm:col-span-1">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex-1 rounded-xl px-3 py-2 transition sm:flex-none sm:py-1.5 ${viewMode === 'kanban' ? 'bg-[#c9a227] text-[#04080f]' : 'text-white/60 hover:text-white'}`}
              title="Visão Kanban"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex-1 rounded-xl px-3 py-2 transition sm:flex-none sm:py-1.5 ${viewMode === 'table' ? 'bg-[#c9a227] text-[#04080f]' : 'text-white/60 hover:text-white'}`}
              title="Visão Tabela"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>

          {viewMode === 'kanban' && (
            <div className="col-span-2 flex rounded-2xl border border-white/5 bg-[#04080f] p-1 sm:col-span-1">
              <button
                type="button"
                onClick={onCollapseAll}
                className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white sm:flex-none sm:py-1.5"
                title="Colapsar todos os cards"
              >
                Collapse all
              </button>
              <button
                type="button"
                onClick={onExpandAll}
                className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white sm:flex-none sm:py-1.5"
                title="Expandir todos os cards"
              >
                Expand all
              </button>
            </div>
          )}
        </div>

        {(filterNeighborhood.length > 0 || filterStatus.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Filtros ativos:</span>
            {filterNeighborhood.map((neighborhood) => (
              <button
                key={`chip-bairro-${neighborhood}`}
                type="button"
                onClick={() => setFilterNeighborhood(filterNeighborhood.filter((item) => item !== neighborhood))}
                className="inline-flex items-center gap-1 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-2.5 py-1 text-[11px] font-semibold text-[#f5d77a] transition hover:border-[#c9a227]/50"
                title={`Remover filtro de bairro: ${neighborhood}`}
              >
                <span className="text-[9px] uppercase tracking-wider text-[#c9a227]/70">Bairro</span>
                {neighborhood}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filterStatus.map((status) => (
              <button
                key={`chip-status-${status}`}
                type="button"
                onClick={() => setFilterStatus(filterStatus.filter((item) => item !== status))}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition hover:brightness-110 ${getLeadStatusClasses(status)}`}
                title={`Remover filtro de status: ${status}`}
              >
                {status}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filteredLeads.length === 0 && (
              <span className="ml-2 text-[11px] text-amber-300">
                Nenhum lead corresponde aos filtros.
              </span>
            )}
          </div>
        )}
      </div>

      {viewMode === 'kanban' && (
        <KanbanDnD
          leads={sortedFilteredLeads}
          leadSyncState={leadSyncState}
          collapsedCards={collapsedCards}
          onStatusChange={onStatusChange}
          onToggleCollapse={onToggleCollapse}
          onOpenDetail={onOpenDetail}
          onOpenEdit={onOpenEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onReorderLead={onReorderLead}
          daysInStatus={daysInStatus}
          formatCurrency={formatCurrency}
          getLeadServiceDate={getLeadServiceDate}
        />
      )}

      {viewMode === 'table' && (
        <div className="rounded-2xl border border-white/5 bg-[#07111d]/50 p-4 shadow-lg backdrop-blur-md sm:rounded-3xl sm:p-6 md:overflow-x-auto">
          <div className="space-y-3 md:hidden">
            {sortedFilteredLeads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-white/5 bg-[#04080f]/85 p-4">
                <button type="button" onClick={() => onOpenDetail(lead)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white">{lead.name}</h3>
                      <p className="mt-1 text-xs text-white/40">{lead.phone || 'Sem telefone'}</p>
                    </div>
                    <span className="shrink-0 text-sm font-black text-[#c9a227]">R$ {formatCurrency(lead.value)}</span>
                  </div>
                </button>

                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-white/60">{lead.neighborhood}</span>
                  <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-white/60">{lead.filmType}</span>
                  {getLeadServiceDate(lead) && (
                    <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 font-semibold text-sky-300">
                      Serviço {format(getLeadServiceDate(lead)!, 'dd/MM')}
                    </span>
                  )}
                  <span className={`rounded-full border px-2.5 py-1 font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>{lead.status}</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs text-white/40">{lead.sqm.toFixed(2)}m² · {daysInStatus(lead)}d no status</span>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => onOpenEdit(lead)} className="text-xs font-semibold text-white/60 hover:text-white">Editar</button>
                    <button type="button" onClick={() => onDelete(lead.id)} className="text-xs font-semibold text-red-300/70 hover:text-red-300">Excluir</button>
                  </div>
                </div>
              </article>
            ))}
            {filteredLeads.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
                <p className="text-sm font-semibold text-white/30">
                  {leads.length === 0 ? 'Nenhum lead cadastrado ainda.' : 'Nenhum lead encontrado com estes filtros.'}
                </p>
                {leads.length === 0 && (
                  <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="mt-3 rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/15"
                  >
                    Criar primeiro lead
                  </button>
                )}
              </div>
            )}
          </div>

          <table className="hidden w-full border-collapse text-left text-sm text-white/80 md:table">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
                <th className="cursor-pointer select-none pb-3 font-semibold hover:text-white" onClick={() => onToggleSort('name')}>
                  Cliente {sortKey === 'name' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="cursor-pointer select-none pb-3 font-semibold hover:text-white" onClick={() => onToggleSort('neighborhood')}>
                  Bairro {sortKey === 'neighborhood' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="cursor-pointer select-none pb-3 font-semibold hover:text-white" onClick={() => onToggleSort('filmType')}>
                  Película {sortKey === 'filmType' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="cursor-pointer select-none pb-3 text-center font-semibold hover:text-white" onClick={() => onToggleSort('sqm')}>
                  Área (m²) {sortKey === 'sqm' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="cursor-pointer select-none pb-3 text-right font-semibold hover:text-white" onClick={() => onToggleSort('value')}>
                  Valor {sortKey === 'value' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="cursor-pointer select-none pb-3 text-center font-semibold hover:text-white" onClick={() => onToggleSort('status')}>
                  Status {sortKey === 'status' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="cursor-pointer select-none pb-3 text-center font-semibold hover:text-white" onClick={() => onToggleSort('dataServico')}>
                  Serviço {sortKey === 'dataServico' && <span className="ml-1 text-[#c9a227]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="pb-3 text-center font-semibold">Dias</th>
                <th className="pb-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedFilteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="group cursor-pointer hover:bg-white/[0.01]"
                  onClick={() => onTableRowClick(lead)}
                  onDoubleClick={() => onTableRowDoubleClick(lead)}
                  title="Clique para ver detalhes. Duplo clique para editar."
                >
                  <td className="py-3.5 font-semibold text-white">
                    <div className="flex flex-col">
                      <span className="border-b border-dotted border-white/20 transition hover:border-[#c9a227]/60">{lead.name}</span>
                      <span className="text-xs font-normal text-white/40">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-white/70">{lead.neighborhood}</td>
                  <td className="py-3.5">
                    <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/70">
                      {lead.filmType}
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-mono">{lead.sqm.toFixed(2)}m²</td>
                  <td className="py-3.5 text-right font-bold text-[#c9a227]">R$ {formatCurrency(lead.value)}</td>
                  <td className="py-3.5 text-center">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-center text-xs font-semibold text-sky-300">
                    {getLeadServiceDate(lead) ? format(getLeadServiceDate(lead)!, 'dd/MM/yyyy') : '—'}
                  </td>
                  <td className="py-3.5 text-center font-mono text-xs text-white/40">{daysInStatus(lead)}d</td>
                  <td className="py-3.5 text-right">
                    <div className="flex justify-end gap-3 opacity-60 transition duration-300 group-hover:opacity-100">
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
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <p className="font-semibold text-white/30">
                        {leads.length === 0 ? 'Nenhum lead cadastrado ainda.' : 'Nenhum lead encontrado com estes filtros.'}
                      </p>
                      {leads.length === 0 && (
                        <button
                          type="button"
                          onClick={onOpenCreateModal}
                          className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/15"
                        >
                          Criar primeiro lead
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const KANBAN_DND_FALLBACK_STYLE = {
  border: 'border-white/5',
  headerBg: 'bg-white/5 text-white/50',
  badge: 'bg-white/5 text-white/80',
};

interface KanbanDnDProps {
  leads: Lead[];
  leadSyncState: Record<string, LeadSyncStatus>;
  collapsedCards: Set<string>;
  onStatusChange: (leadId: string, status: Lead['status']) => void;
  onReorderLead: (activeLeadId: string, overLeadId: string) => void;
  onToggleCollapse: (leadId: string) => void;
  onOpenDetail: (lead: Lead) => void;
  onOpenEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onTogglePin: (leadId: string) => void;
  daysInStatus: (lead: Lead) => number;
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
}

function KanbanDnD({
  leads,
  leadSyncState,
  collapsedCards,
  onStatusChange,
  onToggleCollapse,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onTogglePin,
  onReorderLead,
  daysInStatus,
  formatCurrency,
  getLeadServiceDate,
}: KanbanDnDProps) {
  const stageStyles: Record<string, { border: string; headerBg: string; badge: string }> = {
    Novo: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      headerBg: 'bg-blue-500/10 text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300',
    },
    'Em Contato': {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      headerBg: 'bg-amber-500/10 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300',
    },
    Agendado: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      headerBg: 'bg-purple-500/10 text-purple-400',
      badge: 'bg-purple-500/20 text-purple-300',
    },
    Fechado: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      headerBg: 'bg-emerald-500/10 text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300',
    },
    Perdido: {
      border: 'border-red-500/20 hover:border-red-500/40',
      headerBg: 'bg-red-500/10 text-red-400',
      badge: 'bg-red-500/20 text-red-300',
    },
  };

  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeLead = useMemo(
    () => (activeLeadId ? leads.find((lead) => lead.id === activeLeadId) ?? null : null),
    [activeLeadId, leads],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveLeadId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveLeadId(null);
      const resolved = resolveKanbanDrop(
        { id: event.active.id, data: { current: event.active.data.current as KanbanDragData | undefined } },
        event.over ? { id: event.over.id, data: { current: event.over.data.current as KanbanDragData | undefined } } : null,
      );
      if (!resolved) return;
      if (resolved.isSameStatus) {
        if (resolved.overLeadId) onReorderLead(resolved.leadId, resolved.overLeadId);
        return;
      }
      onStatusChange(resolved.leadId, resolved.toStatus);
    },
    [onReorderLead, onStatusChange],
  );

  const handleDragCancel = useCallback(() => {
    setActiveLeadId(null);
  }, []);

  const announcements = useMemo(
    () => ({
      onDragStart({ active }: { active: { id: string | number } }) {
        const lead = leads.find((entry) => entry.id === active.id);
        return lead ? `Lead ${lead.name} selecionado. Use as setas para mudar de coluna.` : 'Lead selecionado.';
      },
      onDragOver({ active, over }: { active: { id: string | number }; over: { data: { current?: { stage?: LeadStatus } } } | null }) {
        if (!over) return undefined;
        const target = over.data.current?.stage;
        if (!target) return undefined;
        const lead = leads.find((entry) => entry.id === active.id);
        return lead ? `Lead ${lead.name} sobre a coluna ${target}.` : undefined;
      },
      onDragEnd({ active, over }: { active: { id: string | number }; over: { data: { current?: { stage?: LeadStatus } } } | null }) {
        setActiveLeadId(null);
        if (!over) return 'Movimento cancelado.';
        const target = over.data.current?.stage;
        const lead = leads.find((entry) => entry.id === active.id);
        if (!lead || !target) return undefined;
        return `Lead ${lead.name} movido para ${target}.`;
      },
      onDragCancel() {
        return 'Movimento cancelado.';
      },
    }),
    [leads],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{ announcements, screenReaderInstructions: { draggable: 'Para mover um lead, pressione espaco ou enter. Use as setas para reposicionar. Pressione escape para cancelar.' } }}
    >
      <div className="grid gap-3 pb-4 md:grid-cols-5 md:gap-4">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.status === stage);
          const style = stageStyles[stage] || KANBAN_DND_FALLBACK_STYLE;
          return (
            <KanbanColumn
              key={stage}
              stage={stage}
              stageLeads={stageLeads}
              style={style}
              collapsedCards={collapsedCards}
              leadSyncState={leadSyncState}
              onStatusChange={onStatusChange}
              onToggleCollapse={onToggleCollapse}
              onOpenDetail={onOpenDetail}
              onOpenEdit={onOpenEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              daysInStatus={daysInStatus}
              formatCurrency={formatCurrency}
              getLeadServiceDate={getLeadServiceDate}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.43, 1)' }}>
        {activeLead ? (
          <LeadCard
            lead={activeLead}
            collapsed={collapsedCards.has(activeLead.id)}
            daysInStatus={daysInStatus}
            formatCurrency={formatCurrency}
            getLeadServiceDate={getLeadServiceDate}
            syncStatus={leadSyncState[activeLead.id] || 'ok'}
            onToggleCollapse={onToggleCollapse}
            onOpenDetail={onOpenDetail}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
            onTogglePin={onTogglePin}
            onMoveLeft={() => undefined}
            onMoveRight={() => undefined}
            isDragOverlay
            disableMoveLeft={false}
            disableMoveRight={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface KanbanColumnProps {
  stage: LeadStatus;
  stageLeads: Lead[];
  style: { border: string; headerBg: string; badge: string };
  collapsedCards: Set<string>;
  leadSyncState: Record<string, LeadSyncStatus>;
  onStatusChange: (leadId: string, status: Lead['status']) => void;
  onToggleCollapse: (leadId: string) => void;
  onOpenDetail: (lead: Lead) => void;
  onOpenEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onTogglePin: (leadId: string) => void;
  daysInStatus: (lead: Lead) => number;
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
}

function KanbanColumn({
  stage,
  stageLeads,
  style,
  collapsedCards,
  leadSyncState,
  onStatusChange,
  onToggleCollapse,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onTogglePin,
  daysInStatus,
  formatCurrency,
  getLeadServiceDate,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${stage}`, data: { type: 'column', stage } });
  const stageIndex = LEAD_STAGES.indexOf(stage);

  return (
    <div
      ref={setNodeRef}
      data-stage={stage}
      className={`flex min-h-0 flex-col rounded-2xl border ${style.border} bg-[#07111d]/30 p-3 transition duration-300 md:min-h-[500px] md:rounded-3xl md:p-4 ${
        isOver ? 'ring-2 ring-[#c9a227]/60 ring-offset-2 ring-offset-[#04080f] bg-[#c9a227]/[0.04]' : ''
      }`}
    >
      <div className={`mb-4 flex items-center justify-between rounded-xl border-b border-white/5 px-2 py-1 pb-2 ${style.headerBg}`}>
        <span className="text-xs font-black uppercase tracking-wider">{stage}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`}>{stageLeads.length}</span>
      </div>

      <SortableContext items={stageLeads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {stageLeads.map((lead) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              stage={stage}
              collapsed={collapsedCards.has(lead.id)}
              daysInStatus={daysInStatus}
              formatCurrency={formatCurrency}
              getLeadServiceDate={getLeadServiceDate}
              syncStatus={leadSyncState[lead.id] || 'ok'}
              onToggleCollapse={onToggleCollapse}
              onOpenDetail={onOpenDetail}
              onOpenEdit={onOpenEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              onMoveLeft={() => {
                if (stageIndex > 0) onStatusChange(lead.id, LEAD_STAGES[stageIndex - 1]);
              }}
              onMoveRight={() => {
                if (stageIndex < LEAD_STAGES.length - 1) onStatusChange(lead.id, LEAD_STAGES[stageIndex + 1]);
              }}
              disableMoveLeft={stage === 'Novo'}
              disableMoveRight={stage === 'Perdido'}
            />
          ))}

          {stageLeads.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-white/5 p-6 text-center text-xs text-white/20 select-none">
              {isOver ? 'Solte aqui' : 'Coluna Vazia'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
