import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLeadPreferences } from '../useLeadPreferences';
import type { Lead, LeadStatus } from '../../types';

const STORAGE_KEY = 'lume_crm_ui_preferences';

const makeLead = (id: string, overrides: Partial<Lead> = {}): Lead => ({
  id,
  name: `Lead ${id}`,
  phone: '21999999999',
  email: '',
  address: 'Rua A',
  neighborhood: 'Barra da Tijuca',
  filmType: 'Nano Ceramica',
  sqm: 10,
  value: 500,
  status: 'Novo',
  createdAt: '2026-07-01',
  statusChangedAt: '2026-07-01',
  notes: '',
  dormant: false,
  ...overrides,
});

const leads: Lead[] = [
  makeLead('a', { neighborhood: 'Barra da Tijuca', status: 'Novo' }),
  makeLead('b', { neighborhood: 'Recreio dos Bandeirantes', status: 'Em Contato' }),
  makeLead('c', { neighborhood: 'Bangu', status: 'Agendado' }),
  makeLead('d', { neighborhood: 'Barra da Tijuca', status: 'Fechado' }),
  makeLead('e', { neighborhood: 'Outro', status: 'Perdido' }),
];

const flushRestoration = async () => {
  await waitFor(() => {
    // The hook restores preferences on a setTimeout(0); flush it.
  });
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  });
};

describe('useLeadPreferences', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/crm');
  });

  it('returns empty multi-select filters by default and exposes all leads', async () => {
    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    expect(result.current.filterNeighborhood).toEqual([]);
    expect(result.current.filterStatus).toEqual([]);
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredLeads).toHaveLength(leads.length);
  });

  it('applies OR logic within a single multi-select filter (bairros)', async () => {
    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    act(() => {
      result.current.setFilterNeighborhood(['Barra da Tijuca', 'Bangu']);
    });

    expect(result.current.filteredLeads.map((lead) => lead.id).sort()).toEqual(['a', 'c', 'd']);
  });

  it('applies OR logic within statuses and AND logic between filter types', async () => {
    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    act(() => {
      result.current.setFilterNeighborhood(['Barra da Tijuca']);
      result.current.setFilterStatus(['Novo', 'Fechado'] as LeadStatus[]);
    });

    const ids = result.current.filteredLeads.map((lead) => lead.id).sort();
    expect(ids).toEqual(['a', 'd']);
  });

  it('clears all filters and search via clearFilters', async () => {
    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    act(() => {
      result.current.setSearchQuery('Lead a');
      result.current.setFilterNeighborhood(['Barra da Tijuca']);
      result.current.setFilterStatus(['Novo']);
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.filterNeighborhood).toEqual([]);
    expect(result.current.filterStatus).toEqual([]);
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredLeads).toHaveLength(leads.length);
  });

  it('persists multi-select filters to localStorage and URL as CSV', async () => {
    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    act(() => {
      result.current.setFilterNeighborhood(['Barra da Tijuca', 'Recreio dos Bandeirantes']);
      result.current.setFilterStatus(['Novo', 'Agendado']);
    });

    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.filterNeighborhood).toEqual(['Barra da Tijuca', 'Recreio dos Bandeirantes']);
    expect(stored.filterStatus).toEqual(['Novo', 'Agendado']);

    const url = new URL(window.location.href);
    expect(url.searchParams.get('bairro')).toBe('Barra da Tijuca,Recreio dos Bandeirantes');
    expect(url.searchParams.get('status')).toBe('Novo,Agendado');
  });

  it('restores multi-select filters from URL on mount (CSV parse)', async () => {
    window.history.replaceState({}, '', '/crm?bairro=Barra%20da%20Tijuca,Bangu&status=Novo,Agendado');

    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    expect(result.current.filterNeighborhood).toEqual(['Barra da Tijuca', 'Bangu']);
    expect(result.current.filterStatus).toEqual(['Novo', 'Agendado']);
  });

  it('falls back to localStorage when URL has no filter params', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ filterNeighborhood: ['Recreio dos Bandeirantes'], filterStatus: ['Fechado'] }),
    );

    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    expect(result.current.filterNeighborhood).toEqual(['Recreio dos Bandeirantes']);
    expect(result.current.filterStatus).toEqual(['Fechado']);
  });

  it('ignores invalid status values in URL', async () => {
    window.history.replaceState({}, '', '/crm?status=Novo,Invalido,Fechado');

    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    expect(result.current.filterStatus).toEqual(['Novo', 'Fechado']);
  });

  it('URL params override localStorage values (last write wins)', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ filterNeighborhood: ['Bangu'], filterStatus: ['Perdido'] }),
    );
    window.history.replaceState({}, '', '/crm?bairro=Outro&status=Agendado');

    const { result } = renderHook(() => useLeadPreferences(leads));

    await flushRestoration();

    expect(result.current.filterNeighborhood).toEqual(['Outro']);
    expect(result.current.filterStatus).toEqual(['Agendado']);
  });

  it('places pinned leads first in sortedFilteredLeads even without sortKey (issue #10)', async () => {
    const pinnedLead = makeLead('z', { name: 'Zeca (pinned)', pinned: true });
    const { result } = renderHook(() => useLeadPreferences([...leads, pinnedLead]));

    await flushRestoration();

    const firstId = result.current.sortedFilteredLeads[0]?.id;
    expect(firstId).toBe('z');
  });

  it('applies sortKey after pinning when both are configured', async () => {
    const localLeads = [
      makeLead('1', { name: 'A', value: 100, pinned: true }),
      makeLead('2', { name: 'B', value: 200, pinned: false }),
      makeLead('3', { name: 'C', value: 50, pinned: true }),
    ];
    const { result } = renderHook(() => useLeadPreferences(localLeads));

    await flushRestoration();

    act(() => {
      result.current.toggleSort('value');
    });

    const ids = result.current.sortedFilteredLeads.map((lead) => lead.id);
    expect(ids).toEqual(['3', '1', '2']);
  });
});
