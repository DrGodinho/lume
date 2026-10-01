import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AgendaLeadCard } from '../../components/AgendaLeadCard';
import { SERVICE_STATUS_META } from '../useAgenda';
import type { Lead } from '../../types';

const mockLead: Lead = {
  id: 'lead-idle-1',
  name: 'Mariana Silva',
  phone: '21999998888',
  email: 'mariana@example.com',
  address: 'Rua Visconde de Pirajá, 500',
  neighborhood: 'Ipanema',
  filmType: 'Nanocerâmica',
  sqm: 10,
  value: 1800,
  status: 'Novo',
  statusChangedAt: '2026-06-01',
  dataServico: null,
  serviceStatus: 'Marcado',
  proximoContato: null,
  dormant: false,
  pinned: false,
  notes: 'Lead parado sem retorno definido',
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
};

describe('AgendaLeadCard Delete Action', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders Deletar lead button when kind is idle and calls onDeleteLead', () => {
    const onDeleteMock = vi.fn().mockResolvedValue(undefined);

    render(
      <AgendaLeadCard
        lead={mockLead}
        kind="idle"
        onAgendar={vi.fn()}
        onMarcarFeito={vi.fn()}
        onSetDormant={vi.fn()}
        onUpdateServiceStatus={vi.fn()}
        onAbrirLead={vi.fn()}
        onDeleteLead={onDeleteMock}
        getLeadFollowUpDate={() => null}
        getLeadServiceDate={() => null}
        getLeadActivityDate={() => null}
        getLeadServiceStatus={() => 'Marcado'}
        getLeadStatusClasses={() => 'text-white'}
        getLeadPhoneHref={() => '#'}
        getWhatsAppHref={() => '#'}
        serviceStatusMeta={SERVICE_STATUS_META}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /deletar lead/i });
    expect(deleteBtn).toBeDefined();

    fireEvent.click(deleteBtn);
    expect(onDeleteMock).toHaveBeenCalledWith('lead-idle-1');
  });

  it('renders Deletar lead button when kind is dormant', () => {
    render(
      <AgendaLeadCard
        lead={{ ...mockLead, dormant: true }}
        kind="dormant"
        onAgendar={vi.fn()}
        onMarcarFeito={vi.fn()}
        onSetDormant={vi.fn()}
        onUpdateServiceStatus={vi.fn()}
        onAbrirLead={vi.fn()}
        onDeleteLead={vi.fn()}
        getLeadFollowUpDate={() => null}
        getLeadServiceDate={() => null}
        getLeadActivityDate={() => null}
        getLeadServiceStatus={() => 'Marcado'}
        getLeadStatusClasses={() => 'text-white'}
        getLeadPhoneHref={() => '#'}
        getWhatsAppHref={() => '#'}
        serviceStatusMeta={SERVICE_STATUS_META}
      />
    );

    expect(screen.getByRole('button', { name: /deletar lead/i })).toBeDefined();
  });

  it('does NOT render Deletar lead button for followup or service cards', () => {
    const { rerender } = render(
      <AgendaLeadCard
        lead={mockLead}
        kind="followup"
        onAgendar={vi.fn()}
        onMarcarFeito={vi.fn()}
        onSetDormant={vi.fn()}
        onUpdateServiceStatus={vi.fn()}
        onAbrirLead={vi.fn()}
        onDeleteLead={vi.fn()}
        getLeadFollowUpDate={() => new Date('2026-10-02')}
        getLeadServiceDate={() => null}
        getLeadActivityDate={() => null}
        getLeadServiceStatus={() => 'Marcado'}
        getLeadStatusClasses={() => 'text-white'}
        getLeadPhoneHref={() => '#'}
        getWhatsAppHref={() => '#'}
        serviceStatusMeta={SERVICE_STATUS_META}
      />
    );

    expect(screen.queryByRole('button', { name: /deletar lead/i })).toBeNull();

    rerender(
      <AgendaLeadCard
        lead={mockLead}
        kind="service"
        onAgendar={vi.fn()}
        onMarcarFeito={vi.fn()}
        onSetDormant={vi.fn()}
        onUpdateServiceStatus={vi.fn()}
        onAbrirLead={vi.fn()}
        onDeleteLead={vi.fn()}
        getLeadFollowUpDate={() => null}
        getLeadServiceDate={() => new Date('2026-10-05')}
        getLeadActivityDate={() => null}
        getLeadServiceStatus={() => 'Marcado'}
        getLeadStatusClasses={() => 'text-white'}
        getLeadPhoneHref={() => '#'}
        getWhatsAppHref={() => '#'}
        serviceStatusMeta={SERVICE_STATUS_META}
      />
    );

    expect(screen.queryByRole('button', { name: /deletar lead/i })).toBeNull();
  });
});
