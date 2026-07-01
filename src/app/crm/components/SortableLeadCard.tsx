'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LeadCard } from './LeadCard';
import type { Lead, LeadSyncStatus } from '../types';

interface SortableLeadCardProps {
  lead: Lead;
  stage: Lead['status'];
  collapsed: boolean;
  daysInStatus: (lead: Lead) => number;
  formatCurrency: (value: number) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  syncStatus?: LeadSyncStatus;
  onToggleCollapse: (leadId: string) => void;
  onOpenDetail: (lead: Lead) => void;
  onOpenEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onTogglePin: (leadId: string) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  disableMoveLeft: boolean;
  disableMoveRight: boolean;
}

export function SortableLeadCard({
  lead,
  stage,
  collapsed,
  daysInStatus,
  formatCurrency,
  getLeadServiceDate,
  syncStatus,
  onToggleCollapse,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onTogglePin,
  onMoveLeft,
  onMoveRight,
  disableMoveLeft,
  disableMoveRight,
}: SortableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { type: 'lead', stage, leadId: lead.id },
  });

  return (
    <LeadCard
      lead={lead}
      collapsed={collapsed}
      daysInStatus={daysInStatus}
      formatCurrency={formatCurrency}
      getLeadServiceDate={getLeadServiceDate}
      syncStatus={syncStatus}
      onToggleCollapse={onToggleCollapse}
      onOpenDetail={onOpenDetail}
      onOpenEdit={onOpenEdit}
      onDelete={onDelete}
      onTogglePin={onTogglePin}
      onMoveLeft={onMoveLeft}
      onMoveRight={onMoveRight}
      disableMoveLeft={disableMoveLeft}
      disableMoveRight={disableMoveRight}
      sortableRef={setNodeRef}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      sortableAttributes={attributes as unknown as Record<string, unknown>}
      sortableListeners={listeners as unknown as Record<string, unknown>}
      isDragging={isDragging}
    />
  );
}
