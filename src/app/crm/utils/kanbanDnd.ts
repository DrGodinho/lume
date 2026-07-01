import type { LeadStatus } from '../constants/stages';

export interface KanbanDragData {
  type?: string;
  stage?: LeadStatus;
  stageId?: LeadStatus;
  leadId?: string;
}

export interface KanbanDragLike {
  id: string | number;
  data: { current?: KanbanDragData };
}

export interface ResolvedKanbanDrop {
  leadId: string;
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  overLeadId: string | null;
  isSameStatus: boolean;
}

export const resolveKanbanDrop = (active: KanbanDragLike | null, over: KanbanDragLike | null): ResolvedKanbanDrop | null => {
  if (!active || !over) return null;
  if (String(active.id) === String(over.id)) return null;

  const activeData = active.data.current;
  const overData = over.data.current;
  if (!activeData || activeData.type !== 'lead' || !activeData.stage) return null;

  const toStatus = overData?.stage ?? overData?.stageId;
  if (!toStatus) return null;
  const overLeadId = overData?.type === 'lead' ? String(over.id) : null;
  if (activeData.stage === toStatus && !overLeadId) return null;

  return {
    leadId: String(active.id),
    fromStatus: activeData.stage,
    toStatus,
    overLeadId,
    isSameStatus: activeData.stage === toStatus,
  };
};

export const reorderKanbanItems = <T extends { id: string }>(items: T[], activeId: string, overId: string): T[] => {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const overIndex = items.findIndex((item) => item.id === overId);
  if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(activeIndex, 1);
  nextItems.splice(overIndex, 0, movedItem);
  return nextItems;
};
