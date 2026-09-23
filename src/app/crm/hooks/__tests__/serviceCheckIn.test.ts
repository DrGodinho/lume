import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAgendaLists } from '../useAgendaLists';
import type { Lead } from '../../types';

describe('Service Check-in & Confirmation', () => {
  const baseLead: Lead = {
    id: 'lead_1',
    name: 'Cliente Serviço',
    phone: '21999999999',
    email: '',
    address: 'Rua das Flores',
    neighborhood: 'Barra',
    filmType: 'Ceramic Pro',
    sqm: 12,
    value: 1500,
    status: 'Agendado',
    createdAt: '2026-09-01',
    statusChangedAt: '2026-09-01',
    dataServico: '2026-09-22',
    serviceStatus: 'Marcado',
    notes: '',
    dormant: false,
  };

  it('includes today and past services in servicosAguardandoConfirmacao until marked Concluido', () => {
    const todayService = { ...baseLead, id: 'today_1', dataServico: '2026-09-22', serviceStatus: 'Marcado' as const };
    const pastService = { ...baseLead, id: 'past_1', dataServico: '2026-09-20', serviceStatus: 'Marcado' as const };
    const completedService = { ...baseLead, id: 'comp_1', dataServico: '2026-09-22', serviceStatus: 'Concluido' as const };
    const futureService = { ...baseLead, id: 'fut_1', dataServico: '2026-09-30', serviceStatus: 'Marcado' as const };
    const closedLead = { ...baseLead, id: 'closed_1', status: 'Fechado' as const, dataServico: '2026-09-22' };

    const leads: Lead[] = [todayService, pastService, completedService, futureService, closedLead];

    const { result } = renderHook(() =>
      useAgendaLists({
        leads,
        diaSelecionado: null,
        mesVisivel: new Date(2026, 8, 1),
        isClosedLead: (status) => status === 'Fechado' || status === 'Perdido',
        getLeadFollowUpDate: (l) => (l.proximoContato ? new Date(l.proximoContato) : null),
        getLeadServiceDate: (l) => (l.dataServico ? new Date(l.dataServico + 'T12:00:00') : null),
        getLeadActivityDate: (l) => new Date(l.statusChangedAt),
        getLeadServiceStatus: (l) => l.serviceStatus || 'Marcado',
      }),
    );

    // servicosAguardandoConfirmacao should only include today_1 and past_1
    const pendingIds = result.current.servicosAguardandoConfirmacao.map((l) => l.id);
    expect(pendingIds).toContain('today_1');
    expect(pendingIds).toContain('past_1');
    expect(pendingIds).not.toContain('comp_1'); // Concluded
    expect(pendingIds).not.toContain('fut_1'); // Future
    expect(pendingIds).not.toContain('closed_1'); // Already closed
  });

  it('handleCompleteService sets serviceStatus to Concluido and status to Fechado', async () => {
    const patchLeadStatusInfo = vi.fn().mockResolvedValue({ synced: true, lead: baseLead });
    const toast = { success: vi.fn(), error: vi.fn() };

    const handleCompleteService = async (leadId: string) => {
      const today = new Date().toISOString().split('T')[0];
      const { synced } = await patchLeadStatusInfo(leadId, {
        serviceStatus: 'Concluido',
        status: 'Fechado',
        statusChangedAt: today,
        dormant: false,
      });
      if (synced) toast.success('Serviço concluído e venda fechada!');
      else toast.error('Erro');
    };

    await handleCompleteService('lead_1');

    expect(patchLeadStatusInfo).toHaveBeenCalledWith('lead_1', expect.objectContaining({
      serviceStatus: 'Concluido',
      status: 'Fechado',
      dormant: false,
    }));
    expect(toast.success).toHaveBeenCalledWith('Serviço concluído e venda fechada!');
  });

  it('handleRescheduleService updates dataServico and serviceStatus to Reagendar', async () => {
    const patchLeadStatusInfo = vi.fn().mockResolvedValue({ synced: true, lead: baseLead });
    const toast = { success: vi.fn(), error: vi.fn() };

    const handleRescheduleService = async (leadId: string, newDate: string) => {
      const { synced } = await patchLeadStatusInfo(leadId, {
        dataServico: newDate,
        serviceStatus: 'Reagendar',
        status: 'Agendado',
        dormant: false,
      });
      if (synced) toast.success('Serviço reagendado com sucesso.');
      else toast.error('Erro');
    };

    await handleRescheduleService('lead_1', '2026-09-28');

    expect(patchLeadStatusInfo).toHaveBeenCalledWith('lead_1', expect.objectContaining({
      dataServico: '2026-09-28',
      serviceStatus: 'Reagendar',
      status: 'Agendado',
    }));
    expect(toast.success).toHaveBeenCalledWith('Serviço reagendado com sucesso.');
  });
});
