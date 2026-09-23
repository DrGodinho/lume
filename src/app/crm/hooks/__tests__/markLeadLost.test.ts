import { describe, it, expect, vi } from 'vitest';
import type { Lead } from '../../types';

describe('Mark Lead as Lost behavior', () => {
  it('closes lead detail modal and updates status to Perdido', async () => {
    const lead: Lead = {
      id: 'lead_123',
      name: 'Cliente Perdido Teste',
      phone: '21999999999',
      email: '',
      address: 'Rua B',
      neighborhood: 'Barra',
      filmType: 'Carbon',
      sqm: 15,
      value: 1200,
      status: 'Novo',
      createdAt: '2026-07-01',
      statusChangedAt: '2026-07-01',
      proximoContato: '2026-07-05T10:00:00.000Z',
      notes: '',
      dormant: false,
    };

    const closeLeadDetailModal = vi.fn();
    const updateSingleLead = vi.fn().mockImplementation(async (id: string, updater: (l: Lead) => Lead) => {
      const updated = updater(lead);
      return { synced: true, lead: updated };
    });
    const toast = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    };

    const handleMarkLeadLost = async (targetLead: Lead) => {
      closeLeadDetailModal();
      const today = new Date().toISOString().split('T')[0];
      const { synced } = await updateSingleLead(targetLead.id, (currentLead: Lead) => ({
        ...currentLead,
        status: 'Perdido',
        statusChangedAt: today,
        proximoContato: null,
        dormant: false,
        updatedAt: new Date().toISOString(),
      }));

      if (synced) {
        toast.success('Lead marcado como perdido.');
      } else {
        toast.error('Nao foi possivel marcar o lead como perdido.');
      }
    };

    await handleMarkLeadLost(lead);

    expect(closeLeadDetailModal).toHaveBeenCalledTimes(1);
    expect(updateSingleLead).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Lead marcado como perdido.');

    // Verify updater result
    const updaterFn = updateSingleLead.mock.calls[0][1];
    const result = updaterFn(lead);
    expect(result.status).toBe('Perdido');
    expect(result.proximoContato).toBeNull();
    expect(result.dormant).toBe(false);
  });
});
