'use client';

import { format } from 'date-fns';
import { LEAD_STAGES } from '../constants';
import { LeadCard } from './LeadCard';
import type { Lead, LeadSortKey } from '../types';

interface KanbanBoardProps {
  leads: Lead[];
  filteredLeads: Lead[];
  sortedFilteredLeads: Lead[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterNeighborhood: string;
  setFilterNeighborhood: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  neighborhoods: string[];
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
  onStatusChange: (leadId: string, status: Lead['status']) => void;
  onTableRowClick: (lead: Lead) => void;
  onTableRowDoubleClick: (lead: Lead) => void;
  sortKey: LeadSortKey;
  sortDir: 'asc' | 'desc';
  onToggleSort: (key: LeadSortKey) => void;
  daysInStatus: (lead: Lead) => number;
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadStatusClasses: (status: Lead['status']) => string;
}

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
  onStatusChange,
  onTableRowClick,
  onTableRowDoubleClick,
  sortKey,
  sortDir,
  onToggleSort,
  daysInStatus,
  formatCurrency,
  getLeadServiceDate,
  getLeadStatusClasses,
}: KanbanBoardProps) {
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
          <select
            value={filterNeighborhood}
            onChange={(event) => setFilterNeighborhood(event.target.value)}
            className="min-w-0 rounded-2xl border border-white/5 bg-[#04080f] px-3 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none sm:px-4"
          >
            <option value="">Todos os Bairros</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="min-w-0 rounded-2xl border border-white/5 bg-[#04080f] px-3 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none sm:px-4"
          >
            <option value="">Todos os Status</option>
            <option value="Novo">Novo</option>
            <option value="Em Contato">Em Contato</option>
            <option value="Agendado">Agendado</option>
            <option value="Fechado">Fechado</option>
            <option value="Perdido">Perdido</option>
          </select>

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
      </div>

      {viewMode === 'kanban' && (
        <div className="grid gap-3 pb-4 md:grid-cols-5 md:gap-4">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((lead) => lead.status === stage);
            const style = stageStyles[stage] || {
              border: 'border-white/5',
              headerBg: 'bg-white/5 text-white/50',
              badge: 'bg-white/5 text-white/80',
            };

            return (
              <div
                key={stage}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  try {
                    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
                    if (data.fromStage !== stage) onStatusChange(data.id, stage);
                  } catch {
                    return;
                  }
                }}
                className={`flex min-h-0 flex-col rounded-2xl border ${style.border} bg-[#07111d]/30 p-3 transition duration-300 md:min-h-[500px] md:rounded-3xl md:p-4`}
              >
                <div className={`mb-4 flex items-center justify-between rounded-xl border-b border-white/5 px-2 py-1 pb-2 ${style.headerBg}`}>
                  <span className="text-xs font-black uppercase tracking-wider">{stage}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`}>{stageLeads.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.map((lead) => {
                    const stageIndex = LEAD_STAGES.indexOf(stage);

                    return (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        collapsed={collapsedCards.has(lead.id)}
                        daysInStatus={daysInStatus}
                        formatCurrency={formatCurrency}
                        getLeadServiceDate={getLeadServiceDate}
                        onToggleCollapse={onToggleCollapse}
                        onOpenDetail={onOpenDetail}
                        onOpenEdit={onOpenEdit}
                        onDelete={onDelete}
                        onMoveLeft={() => {
                          if (stageIndex > 0) onStatusChange(lead.id, LEAD_STAGES[stageIndex - 1]);
                        }}
                        onMoveRight={() => {
                          if (stageIndex < LEAD_STAGES.length - 1) onStatusChange(lead.id, LEAD_STAGES[stageIndex + 1]);
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', JSON.stringify({ id: lead.id, fromStage: stage }));
                          event.currentTarget.classList.add('opacity-40');
                        }}
                        onDragEnd={(event) => event.currentTarget.classList.remove('opacity-40')}
                        disableMoveLeft={stage === 'Novo'}
                        disableMoveRight={stage === 'Perdido'}
                      />
                    );
                  })}

                  {stageLeads.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-white/5 p-6 text-center text-xs text-white/20 select-none">
                      Coluna Vazia
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
