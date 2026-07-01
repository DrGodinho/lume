import { describe, expect, it } from 'vitest';
import { reorderKanbanItems, resolveKanbanDrop, type KanbanDragLike } from '../../utils/kanbanDnd';
import type { LeadStatus } from '../../constants/stages';

const leadActive = (id: string, stage: LeadStatus): KanbanDragLike => ({
  id,
  data: { current: { type: 'lead', stage } },
});

const columnOver = (stage: LeadStatus): KanbanDragLike => ({
  id: `column-${stage}`,
  data: { current: { type: 'column', stage } },
});

const cardOver = (id: string, stage: LeadStatus): KanbanDragLike => ({
  id,
  data: { current: { type: 'lead', stage } },
});

describe('resolveKanbanDrop (issue #5)', () => {
  it('returns a status change when dropping on a different column', () => {
    const result = resolveKanbanDrop(leadActive('lead_1', 'Novo'), columnOver('Agendado'));
    expect(result).toEqual({ leadId: 'lead_1', fromStatus: 'Novo', toStatus: 'Agendado', overLeadId: null, isSameStatus: false });
  });

  it('returns a status change when dropping on a card in a different column', () => {
    const result = resolveKanbanDrop(leadActive('lead_1', 'Em Contato'), cardOver('lead_2', 'Fechado'));
    expect(result).toEqual({ leadId: 'lead_1', fromStatus: 'Em Contato', toStatus: 'Fechado', overLeadId: 'lead_2', isSameStatus: false });
  });

  it('returns null when dropping on the same column background without changing order', () => {
    expect(resolveKanbanDrop(leadActive('lead_1', 'Agendado'), columnOver('Agendado'))).toBeNull();
  });

  it('returns a reorder-only drop when dropping on a card in the same column', () => {
    const result = resolveKanbanDrop(leadActive('lead_1', 'Agendado'), cardOver('lead_2', 'Agendado'));
    expect(result).toEqual({ leadId: 'lead_1', fromStatus: 'Agendado', toStatus: 'Agendado', overLeadId: 'lead_2', isSameStatus: true });
  });

  it('returns null when there is no over target', () => {
    expect(resolveKanbanDrop(leadActive('lead_1', 'Novo'), null)).toBeNull();
  });

  it('returns null when the active item is not a lead (e.g. column itself)', () => {
    expect(resolveKanbanDrop(columnOver('Novo'), columnOver('Agendado'))).toBeNull();
  });

  it('returns null when data is missing on either side', () => {
    expect(resolveKanbanDrop({ id: 'x', data: {} }, columnOver('Agendado'))).toBeNull();
    expect(resolveKanbanDrop(leadActive('lead_1', 'Novo'), { id: 'y', data: {} })).toBeNull();
  });

  it('accepts a column payload with stageId as fallback (defensive against renamed keys)', () => {
    const result = resolveKanbanDrop(
      leadActive('lead_1', 'Novo'),
      { id: 'column-Fechado', data: { current: { type: 'column', stageId: 'Fechado' } } },
    );
    expect(result).toEqual({ leadId: 'lead_1', fromStatus: 'Novo', toStatus: 'Fechado', overLeadId: null, isSameStatus: false });
  });

  it('handles numeric IDs (e.g. dnd-kit synthetic ids)', () => {
    const result = resolveKanbanDrop(
      { id: 42, data: { current: { type: 'lead', stage: 'Novo' } } },
      columnOver('Perdido'),
    );
    expect(result).toEqual({ leadId: '42', fromStatus: 'Novo', toStatus: 'Perdido', overLeadId: null, isSameStatus: false });
  });
});

describe('reorderKanbanItems', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

  it('moves the active item to the target item position', () => {
    expect(reorderKanbanItems(items, 'a', 'c').map((item) => item.id)).toEqual(['b', 'c', 'a', 'd']);
    expect(reorderKanbanItems(items, 'd', 'b').map((item) => item.id)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('keeps the same reference when ids are invalid or unchanged', () => {
    expect(reorderKanbanItems(items, 'x', 'b')).toBe(items);
    expect(reorderKanbanItems(items, 'a', 'x')).toBe(items);
    expect(reorderKanbanItems(items, 'a', 'a')).toBe(items);
  });
});
