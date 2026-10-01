import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LeadCard } from '../../components/LeadCard';
import { LeadDetailModal } from '../../components/LeadModal';
import type { Lead } from '../../types';

const baseLead: Lead = {
  id: 'lead-closed-1',
  name: 'Carlos Oliveira',
  phone: '21988887777',
  email: 'carlos@example.com',
  address: 'Av das Americas 1000',
  neighborhood: 'Barra da Tijuca',
  filmType: 'Nanocerâmica',
  sqm: 15,
  value: 2500,
  status: 'Fechado',
  statusChangedAt: '2026-06-15',
  dataServico: '2026-06-20',
  serviceStatus: 'Concluido',
  proximoContato: null,
  dormant: false,
  pinned: false,
  notes: 'Cliente satisfeito',
  createdAt: '2026-06-10',
  updatedAt: '2026-06-15',
};

describe('Lead Archive Actions', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders Archive button on LeadCard when status is Fechado and onArchive is provided', () => {
    const onArchiveMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <LeadCard
        lead={baseLead}
        collapsed={false}
        formatCurrency={(val) => val.toFixed(2)}
        getLeadServiceDate={() => null}
        getLeadFollowUpDate={() => null}
        onToggleCollapse={vi.fn()}
        onOpenDetail={vi.fn()}
        onOpenEdit={vi.fn()}
        onDelete={onDeleteMock}
        onArchive={onArchiveMock}
        onTogglePin={vi.fn()}
        onMoveLeft={vi.fn()}
        onMoveRight={vi.fn()}
        disableMoveLeft={false}
        disableMoveRight={false}
      />
    );

    const archiveBtn = screen.getByTitle('Arquivar lead fechado');
    expect(archiveBtn).toBeDefined();
    expect(screen.queryByTitle('Excluir')).toBeNull();

    fireEvent.click(archiveBtn);
    expect(onArchiveMock).toHaveBeenCalledWith('lead-closed-1');
    expect(onDeleteMock).not.toHaveBeenCalled();
  });

  it('renders Excluir button on LeadCard when status is not Fechado', () => {
    const onArchiveMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <LeadCard
        lead={{ ...baseLead, status: 'Em Contato' }}
        collapsed={false}
        formatCurrency={(val) => val.toFixed(2)}
        getLeadServiceDate={() => null}
        getLeadFollowUpDate={() => null}
        onToggleCollapse={vi.fn()}
        onOpenDetail={vi.fn()}
        onOpenEdit={vi.fn()}
        onDelete={onDeleteMock}
        onArchive={onArchiveMock}
        onTogglePin={vi.fn()}
        onMoveLeft={vi.fn()}
        onMoveRight={vi.fn()}
        disableMoveLeft={false}
        disableMoveRight={false}
      />
    );

    const deleteBtn = screen.getByTitle('Excluir');
    expect(deleteBtn).toBeDefined();
    expect(screen.queryByTitle('Arquivar lead fechado')).toBeNull();

    fireEvent.click(deleteBtn);
    expect(onDeleteMock).toHaveBeenCalledWith('lead-closed-1');
    expect(onArchiveMock).not.toHaveBeenCalled();
  });

  it('renders Arquivar Lead in LeadDetailModal when lead is Fechado and triggers onArchiveLead', () => {
    const onArchiveLeadMock = vi.fn();

    render(
      <LeadDetailModal
        leadDetail={baseLead}
        leadStatusHistory={[]}
        loadingLeadStatusHistory={false}
        linkedOrcamento={null}
        getLeadPhoneHref={() => ''}
        getLeadStatusClasses={() => ''}
        getLeadServiceDate={() => null}
        getLeadFollowUpDate={() => null}
        getWhatsAppHref={() => ''}
        formatCurrency={(val) => val.toFixed(2)}
        onClose={vi.fn()}
        onOpenEdit={vi.fn()}
        onDuplicate={vi.fn()}
        onOpenCommercialAction={vi.fn()}
        onOpenHistory={vi.fn()}
        onArchiveLead={onArchiveLeadMock}
      />
    );

    const archiveBtn = screen.getByRole('button', { name: /Arquivar Lead/i });
    expect(archiveBtn).toBeDefined();
    expect(screen.queryByRole('button', { name: /Fechar Venda/i })).toBeNull();

    fireEvent.click(archiveBtn);
    expect(onArchiveLeadMock).toHaveBeenCalledWith(baseLead);
  });
});
