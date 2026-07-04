import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLeadMutations } from '../useLeadMutations';
import { createDefaultPlaybookRules } from '../../utils/playbooks';
import type { Lead, LeadFormValues } from '../../types';

const baseLead: Lead = {
  id: 'lead_1',
  name: 'Cliente Teste',
  phone: '21999999999',
  email: '',
  address: 'Rua A',
  neighborhood: 'Bangu',
  filmType: 'Nano Ceramica',
  sqm: 10,
  value: 500,
  status: 'Novo',
  createdAt: '2026-07-01',
  statusChangedAt: '2026-07-01',
  notes: '',
  dormant: false,
};

const leadForm: LeadFormValues = {
  ...baseLead,
  statusChangedAt: '2026-07-01',
};

const createParams = (overrides: Partial<Parameters<typeof useLeadMutations>[0]> = {}) => ({
  leads: [baseLead],
  setLeads: vi.fn(),
  setTrashedLeads: vi.fn(),
  leadForm,
  selectedLead: null,
  pendingCalculatorHistoryId: null,
  closeLeadModal: vi.fn(),
  syncLeadToCloud: vi.fn().mockResolvedValue(true),
  syncLeadStatusPatch: vi.fn().mockResolvedValue(baseLead),
  upsertLeadInState: vi.fn((lead: Lead) => lead),
  linkCalculatorHistoryToLead: vi.fn().mockResolvedValue(true),
  setCrmSync: vi.fn(),
  markLeadSyncState: vi.fn(),
  playbookRules: createDefaultPlaybookRules(),
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
  ...overrides,
});

describe('useLeadMutations', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('creates a lead optimistically and syncs it through POST', async () => {
    const params = createParams();
    const { result } = renderHook(() => useLeadMutations(params));

    await act(async () => {
      await result.current.handleLeadSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(params.upsertLeadInState).toHaveBeenCalledTimes(1);
    expect(params.syncLeadToCloud).toHaveBeenCalledWith(expect.objectContaining({ name: 'Cliente Teste' }), 'POST');
    expect(params.closeLeadModal).toHaveBeenCalledTimes(1);
    expect(params.toast.success).toHaveBeenCalledWith('Lead criado com sucesso!');
  });

  it('applies the default Novo playbook when creating a lead without next action', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-01T09:00:00'));
    const params = createParams();
    const { result } = renderHook(() => useLeadMutations(params));

    await act(async () => {
      await result.current.handleLeadSave();
    });

    expect(params.syncLeadToCloud).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'Novo',
        proximoContato: expect.stringMatching(/^2026-07-03T/),
      }),
      'POST',
    );
  });

  it('rolls back optimistic updates when cloud sync fails', async () => {
    const params = createParams({
      syncLeadToCloud: vi.fn().mockResolvedValue(false),
    });
    const { result } = renderHook(() => useLeadMutations(params));

    await act(async () => {
      await result.current.updateSingleLead('lead_1', (lead) => ({ ...lead, status: 'Em Contato' }));
    });

    expect(params.upsertLeadInState).toHaveBeenNthCalledWith(1, expect.objectContaining({ status: 'Em Contato' }));
    expect(params.upsertLeadInState).toHaveBeenNthCalledWith(2, baseLead);
  });

  describe('handleLeadSave (issue #8: warning when no next action)', () => {
    const disabledPlaybookRules = createDefaultPlaybookRules().map((rule) => ({ ...rule, enabled: false }));

    it('shows a warning toast when saving an Agendado lead without proximoContato', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Agendado', proximoContato: null },
        playbookRules: disabledPlaybookRules,
      });
      const { result } = renderHook(() => useLeadMutations(params));

      let saved: boolean = false;
      await act(async () => {
        saved = await result.current.handleLeadSave();
      });

      expect(saved).toBe(true);
      expect(params.toast.warning).toHaveBeenCalledWith(expect.stringContaining('Lead salvo sem proxima acao'));
      expect(params.toast.success).not.toHaveBeenCalled();
    });

    it('shows a warning toast when saving an Em Contato lead without proximoContato', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Em Contato', proximoContato: null },
        playbookRules: disabledPlaybookRules,
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleLeadSave();
      });

      expect(params.toast.warning).toHaveBeenCalledWith(expect.stringContaining('Lead salvo sem proxima acao'));
    });

    it('does not warn when Agendado lead has a proximoContato', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Agendado', proximoContato: '2026-07-15' },
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleLeadSave();
      });

      expect(params.toast.warning).not.toHaveBeenCalled();
      expect(params.toast.success).toHaveBeenCalledWith('Lead criado com sucesso!');
    });

    it('does not warn and links the budget when Agendado lead has a service date', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Agendado', proximoContato: null, dataServico: '2026-07-20' },
        pendingCalculatorHistoryId: 'history_1',
        playbookRules: disabledPlaybookRules,
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleLeadSave();
      });

      expect(params.toast.warning).not.toHaveBeenCalled();
      expect(params.linkCalculatorHistoryToLead).toHaveBeenCalledWith('history_1', expect.stringMatching(/^lead_/));
      expect(params.toast.success).toHaveBeenCalledWith('Lead criado com sucesso!');
    });

    it('does not warn when status is Novo (no date required)', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Novo', proximoContato: null },
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleLeadSave();
      });

      expect(params.toast.warning).not.toHaveBeenCalled();
      expect(params.toast.success).toHaveBeenCalledWith('Lead criado com sucesso!');
    });

    it('does not warn when status is Fechado (no date required)', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Fechado', proximoContato: null },
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleLeadSave();
      });

      expect(params.toast.warning).not.toHaveBeenCalled();
      expect(params.toast.success).toHaveBeenCalledWith('Lead criado com sucesso!');
    });

    it('warns in edit mode too (status is Agendado, no date)', async () => {
      const params = createParams({
        leadForm: { ...leadForm, status: 'Agendado', proximoContato: null },
        selectedLead: { ...baseLead, status: 'Agendado', proximoContato: null },
        playbookRules: disabledPlaybookRules,
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleLeadSave();
      });

      expect(params.toast.warning).toHaveBeenCalledWith(expect.stringContaining('Lead salvo sem proxima acao'));
      expect(params.toast.success).not.toHaveBeenCalled();
    });
  });

  describe('handleTogglePin (issue #10) — partial status info update (issue #29)', () => {
    it('toggles pinned from false to true via partial status patch (no full lead PUT)', async () => {
      const params = createParams();
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleTogglePin('lead_1');
      });

      const upsertCalls = vi.mocked(params.upsertLeadInState).mock.calls;
      expect(upsertCalls).toHaveLength(1);
      expect(upsertCalls[0][0].pinned).toBe(true);

      const patchCalls = vi.mocked(params.syncLeadStatusPatch).mock.calls;
      expect(patchCalls).toHaveLength(1);
      expect(patchCalls[0][0]).toBe('lead_1');
      expect(patchCalls[0][1].pinned).toBe(true);
      expect(patchCalls[0][1]).not.toHaveProperty('name');
      expect(patchCalls[0][1]).not.toHaveProperty('phone');
      expect(params.toast.error).not.toHaveBeenCalled();
      expect(vi.mocked(params.syncLeadToCloud).mock.calls).toHaveLength(0);
    });

    it('toggles pinned from true to false via partial status patch', async () => {
      const params = createParams({
        leads: [{ ...baseLead, pinned: true }],
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleTogglePin('lead_1');
      });

      const patchCalls = vi.mocked(params.syncLeadStatusPatch).mock.calls;
      expect(patchCalls).toHaveLength(1);
      expect(patchCalls[0][1].pinned).toBe(false);
    });

    it('shows error toast and rolls back when cloud sync fails', async () => {
      const params = createParams({
        syncLeadStatusPatch: vi.fn().mockResolvedValue(null),
      });
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleTogglePin('lead_1');
      });

      expect(params.toast.error).toHaveBeenCalledWith(expect.stringContaining('pin do lead'));
      const upsertCalls = vi.mocked(params.upsertLeadInState).mock.calls;
      expect(upsertCalls).toHaveLength(2);
      expect(upsertCalls[1][0].pinned).toBeFalsy();
    });
  });

  describe('partial status info updates (issue #29)', () => {
    it('handleAgendaSchedule sends only proximoContato + dormant subset', async () => {
      const params = createParams();
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleAgendaSchedule('lead_1', '2026-08-01');
      });

      const patchCalls = vi.mocked(params.syncLeadStatusPatch).mock.calls;
      expect(patchCalls).toHaveLength(1);
      expect(patchCalls[0][0]).toBe('lead_1');
      expect(patchCalls[0][1].proximoContato).toBeTruthy();
      expect(patchCalls[0][1].dormant).toBe(false);
      expect(patchCalls[0][1]).not.toHaveProperty('name');
      expect(patchCalls[0][1]).not.toHaveProperty('phone');
      expect(params.toast.success).toHaveBeenCalledWith('Retorno agendado com sucesso!');
    });

    it('handleAgendaMarkDone sends only proximoContato: null subset', async () => {
      const params = createParams();
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleAgendaMarkDone('lead_1');
      });

      const patchCalls = vi.mocked(params.syncLeadStatusPatch).mock.calls;
      expect(patchCalls).toHaveLength(1);
      expect(patchCalls[0][1].proximoContato).toBeNull();
      expect(patchCalls[0][1]).not.toHaveProperty('status');
    });

    it('handleServiceStatusChange sends only status info fields (no core fields)', async () => {
      const params = createParams();
      const { result } = renderHook(() => useLeadMutations(params));

      await act(async () => {
        await result.current.handleServiceStatusChange('lead_1', 'Confirmado');
      });

      const patchCalls = vi.mocked(params.syncLeadStatusPatch).mock.calls;
      expect(patchCalls).toHaveLength(1);
      const patch = patchCalls[0][1];
      expect(patch).toHaveProperty('status');
      expect(patch).toHaveProperty('serviceStatus', 'Confirmado');
      expect(patch).toHaveProperty('dormant', false);
      expect(patch).not.toHaveProperty('name');
      expect(patch).not.toHaveProperty('phone');
      expect(patch).not.toHaveProperty('value');
    });
  });
});
