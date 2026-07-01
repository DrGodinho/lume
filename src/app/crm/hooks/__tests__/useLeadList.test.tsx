import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadConfigFromCloud } from '@/lib/cloudSync';
import { useLeadList } from '../useLeadList';
import type { Lead } from '../../types';

vi.mock('@/lib/supabase', () => ({ supabase: null }));
vi.mock('@/lib/cloudSync', () => ({ loadConfigFromCloud: vi.fn() }));

const toast = {
  error: vi.fn(),
};

const lead: Lead = {
  id: 'lead_1',
  name: 'Cliente Teste',
  phone: '21999999999',
  email: '',
  address: 'Rua A',
  neighborhood: 'Bangu',
  filmType: 'Nano Ceramica',
  sqm: 12.345,
  value: 456.789,
  status: 'Novo',
  createdAt: '2026-07-01',
  statusChangedAt: '2026-07-01',
  notes: '',
  dormant: false,
};

describe('useLeadList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadConfigFromCloud).mockResolvedValue(null);
  });

  it('starts empty and upserts normalized leads into local state', () => {
    const { result } = renderHook(() => useLeadList('dashboard', toast));

    expect(result.current.leads).toEqual([]);

    act(() => {
      result.current.upsertLeadInState(lead);
    });

    expect(result.current.leads).toHaveLength(1);
    expect(result.current.leads[0]).toMatchObject({
      id: 'lead_1',
      sqm: 12.35,
      value: 456.79,
      serviceStatus: null,
    });
  });

  it('loads film options from calculator cloud config', async () => {
    vi.mocked(loadConfigFromCloud).mockResolvedValue({
      rollW: 1.52,
      price: 100,
      margin: 30,
      modoOtimizacao: 'facilidade',
      userName: 'Teste',
      modoPerdas: 'dinamico',
      perdasFixas: 20,
      modoCorConfig: 'tamanho',
      agressividadeCorte: 35,
      filmTypes: {
        carbono: 80,
        refletiva: 95,
      },
      selectedFilm: 'refletiva',
    });

    const { result } = renderHook(() => useLeadList('dashboard', toast));

    await waitFor(() => {
      expect(result.current.defaultLeadFilmType).toBe('Refletiva');
    });

    expect(result.current.filmTypeOptions).toEqual(expect.arrayContaining(['Carbono', 'Refletiva']));
  });
});
