'use client';

import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { LEAD_STAGES, LEAD_STAGE_STYLES } from '../constants';
import type { LeadStatus } from '../constants/stages';
import { resolveKanbanDrop, type KanbanDragData } from '../utils/kanbanDnd';
import { LeadCard } from './LeadCard';
import { LeadListItem } from './LeadListItem';
import { LeadTable, LeadTableEmpty } from './LeadTable';
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
  getLeadFollowUpDate: (lead: Lead) => Date | null;
  getLeadStatusClasses: (status: Lead['status']) => string;
  leadSyncState: Record<string, LeadSyncStatus>;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
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
  getLeadFollowUpDate,
  getLeadStatusClasses,
  leadSyncState,
  searchInputRef,
}: KanbanBoardProps) {
  const [tableVisibleCount, setTableVisibleCount] = useState(KANBAN_COLUMN_PAGE_SIZE);
  const visibleTableLeads = sortedFilteredLeads.slice(0, tableVisibleCount);
  const hiddenTableCount = sortedFilteredLeads.length - visibleTableLeads.length;

  const loadMoreTable = useCallback(
    () => setTableVisibleCount((current) => current + KANBAN_COLUMN_PAGE_SIZE),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#07111d]/50 p-4 shadow-lg backdrop-blur-md sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchInputRef}
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
                Recolher
              </button>
              <button
                type="button"
                onClick={onExpandAll}
                className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white sm:flex-none sm:py-1.5"
                title="Expandir todos os cards"
              >
                Expandir
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
          formatCurrency={formatCurrency}
          getLeadServiceDate={getLeadServiceDate}
          getLeadFollowUpDate={getLeadFollowUpDate}
        />
      )}

      {viewMode === 'table' && (
        <div className="rounded-2xl border border-white/5 bg-[#07111d]/50 p-4 shadow-lg backdrop-blur-md sm:rounded-3xl sm:p-6 md:overflow-x-auto">
          <div className="space-y-3 md:hidden">
            {visibleTableLeads.map((lead) => (
              <LeadListItem
                key={lead.id}
                lead={lead}
                getLeadServiceDate={getLeadServiceDate}
                daysInStatus={daysInStatus}
                onOpenDetail={onOpenDetail}
                onOpenEdit={onOpenEdit}
                onDelete={onDelete}
              />
            ))}
            {hiddenTableCount > 0 && (
              <button
                type="button"
                onClick={loadMoreTable}
                className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-2.5 text-sm font-semibold text-white/50 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a]"
              >
                Ver mais {hiddenTableCount} lead{hiddenTableCount === 1 ? '' : 's'}
              </button>
            )}
            {filteredLeads.length === 0 && (
              <LeadTableEmpty
                message={leads.length === 0 ? 'Nenhum lead cadastrado ainda.' : 'Nenhum lead encontrado com estes filtros.'}
                actionLabel={leads.length === 0 ? 'Criar primeiro lead' : undefined}
                onAction={leads.length === 0 ? onOpenCreateModal : undefined}
              />
            )}
          </div>

          <LeadTable
            leads={visibleTableLeads}
            emptyMessage={leads.length === 0 ? 'Nenhum lead cadastrado ainda.' : 'Nenhum lead encontrado com estes filtros.'}
            emptyActionLabel={leads.length === 0 ? 'Criar primeiro lead' : undefined}
            onEmptyAction={leads.length === 0 ? onOpenCreateModal : undefined}
            onOpenEdit={onOpenEdit}
            onRowClick={onTableRowClick}
            onRowDoubleClick={onTableRowDoubleClick}
            onDelete={onDelete}
            sortKey={sortKey}
            sortDir={sortDir}
            onToggleSort={onToggleSort}
            daysInStatus={daysInStatus}
            getLeadServiceDate={getLeadServiceDate}
            tableClassName="hidden w-full border-collapse text-left text-sm text-white/80 md:table"
          />
          {hiddenTableCount > 0 && (
            <button
              type="button"
              onClick={loadMoreTable}
              className="mt-4 w-full rounded-2xl border border-white/5 bg-white/[0.02] py-2.5 text-sm font-semibold text-white/50 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a]"
            >
              Ver mais {hiddenTableCount} lead{hiddenTableCount === 1 ? '' : 's'}
            </button>
          )}
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

const NOOP_MOVE = () => undefined;

const KANBAN_COLUMN_PAGE_SIZE = 25;

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
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
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
  formatCurrency,
  getLeadServiceDate,
  getLeadFollowUpDate,
}: KanbanDnDProps) {
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 1000,
        tolerance: 5,
      },
    }),
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
          const style = LEAD_STAGE_STYLES[stage] || KANBAN_DND_FALLBACK_STYLE;
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
              formatCurrency={formatCurrency}
              getLeadServiceDate={getLeadServiceDate}
              getLeadFollowUpDate={getLeadFollowUpDate}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.43, 1)' }}>
        {activeLead ? (
          <LeadCard
            lead={activeLead}
            collapsed={collapsedCards.has(activeLead.id)}
            formatCurrency={formatCurrency}
            getLeadServiceDate={getLeadServiceDate}
            getLeadFollowUpDate={getLeadFollowUpDate}
            syncStatus={leadSyncState[activeLead.id] || 'ok'}
            onToggleCollapse={onToggleCollapse}
            onOpenDetail={onOpenDetail}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
            onTogglePin={onTogglePin}
            onMoveLeft={NOOP_MOVE}
            onMoveRight={NOOP_MOVE}
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
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
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
  formatCurrency,
  getLeadServiceDate,
  getLeadFollowUpDate,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${stage}`, data: { type: 'column', stage } });
  const stageIndex = LEAD_STAGES.indexOf(stage);
  const handleMoveLeft = useCallback(
    (leadId: string) => {
      if (stageIndex > 0) onStatusChange(leadId, LEAD_STAGES[stageIndex - 1]);
    },
    [stageIndex, onStatusChange],
  );
  const handleMoveRight = useCallback(
    (leadId: string) => {
      if (stageIndex < LEAD_STAGES.length - 1) onStatusChange(leadId, LEAD_STAGES[stageIndex + 1]);
    },
    [stageIndex, onStatusChange],
  );
  const [visibleCount, setVisibleCount] = useState(KANBAN_COLUMN_PAGE_SIZE);
  const visibleStageLeads = stageLeads.slice(0, visibleCount);
  const hiddenStageCount = stageLeads.length - visibleStageLeads.length;

  const loadMoreStage = useCallback(
    () => setVisibleCount((current) => current + KANBAN_COLUMN_PAGE_SIZE),
    [],
  );

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

      <SortableContext items={visibleStageLeads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {visibleStageLeads.map((lead) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              stage={stage}
              collapsed={collapsedCards.has(lead.id)}
              formatCurrency={formatCurrency}
              getLeadServiceDate={getLeadServiceDate}
              getLeadFollowUpDate={getLeadFollowUpDate}
              syncStatus={leadSyncState[lead.id] || 'ok'}
              onToggleCollapse={onToggleCollapse}
              onOpenDetail={onOpenDetail}
              onOpenEdit={onOpenEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              disableMoveLeft={stage === 'Novo'}
              disableMoveRight={stage === 'Perdido'}
            />
          ))}

          {hiddenStageCount > 0 && (
            <button
              type="button"
              onClick={loadMoreStage}
              className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-2 text-xs font-semibold text-white/50 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a]"
            >
                Ver mais {hiddenStageCount} lead{hiddenStageCount === 1 ? '' : 's'}
            </button>
          )}

          {visibleStageLeads.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-white/5 p-6 text-center text-xs text-white/20 select-none">
              {isOver ? 'Solte aqui' : 'Coluna Vazia'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
