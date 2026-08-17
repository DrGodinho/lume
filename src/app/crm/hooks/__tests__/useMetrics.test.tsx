import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMetrics } from '../useMetrics';
import type { Lead } from '../../types';

const makeLead = (id: string, overrides: Partial<Lead> = {}): Lead => ({
  id,
  name: `Lead ${id}`,
  phone: '21999999999',
  email: '',
  address: 'Rua A',
  neighborhood: 'Bangu',
  filmType: 'Nano Ceramica',
  sqm: 10,
  value: 1000,
  status: 'Novo',
  createdAt: '2026-07-01',
  statusChangedAt: '2026-07-01',
  notes: '',
  dormant: false,
  ...overrides,
});

describe('useMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-02T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps previous month totals and line data across the full previous month', () => {
    const leads = [
      makeLead('previous-month', {
        status: 'Fechado',
        statusChangedAt: '2026-06-15',
        value: 2500,
      }),
    ];

    const { result } = renderHook(() => useMetrics(leads, 5000));

    expect(result.current.monthlyEvolution.currentTotal).toBe(0);
    expect(result.current.monthlyEvolution.previousTotal).toBe(2500);
    expect(result.current.monthlyEvolution.previousCount).toBe(1);
    expect(result.current.targetPercent).toBe(0);

    const alignedJune15 = result.current.monthlyEvolution.chartData.find((point) => point.dia === '15/07');
    expect(alignedJune15).toMatchObject({
      diaAnterior: '15/06',
      anterior: 2500,
      anteriorDia: 2500,
    });
  });

  it('calculates target progress from current month revenue only', () => {
    const leads = [
      makeLead('previous-month', {
        status: 'Fechado',
        statusChangedAt: '2026-06-15',
        value: 2500,
      }),
      makeLead('current-month', {
        status: 'Fechado',
        statusChangedAt: '2026-07-02',
        value: 1000,
      }),
    ];

    const { result } = renderHook(() => useMetrics(leads, 2000));

    expect(result.current.monthlyEvolution.currentTotal).toBe(1000);
    expect(result.current.monthlyEvolution.previousTotal).toBe(2500);
    expect(result.current.targetPercent).toBe(50);
  });

  it('periodSummary defaults to the current month when no period is given', () => {
    const leads = [
      makeLead('previous-month', { status: 'Fechado', statusChangedAt: '2026-06-15', value: 2500 }),
      makeLead('current-month', { status: 'Fechado', statusChangedAt: '2026-07-02', value: 1000 }),
    ];

    const { result } = renderHook(() => useMetrics(leads, 5000));

    expect(result.current.periodSummary.revenue).toBe(1000);
    expect(result.current.periodSummary.count).toBe(1);
    expect(result.current.periodSummary.label).toBe('Este mês');
  });

  it('periodSummary recalculates for a 30d range', () => {
    const leads = [
      makeLead('june-15', { status: 'Fechado', statusChangedAt: '2026-06-15', value: 2500 }),
      makeLead('june-28', { status: 'Fechado', statusChangedAt: '2026-06-28', value: 300 }),
      makeLead('out-of-range', { status: 'Fechado', statusChangedAt: '2026-05-01', value: 9999 }),
    ];

    const { result } = renderHook(() => useMetrics(leads, 5000, {}, '30d'));

    expect(result.current.periodSummary.revenue).toBe(2800);
    expect(result.current.periodSummary.count).toBe(2);
  });

  it('periodSummary supports a custom date range', () => {
    const leads = [
      makeLead('in-range', { status: 'Fechado', statusChangedAt: '2026-06-15', value: 2500 }),
      makeLead('out-of-range', { status: 'Fechado', statusChangedAt: '2026-07-01', value: 9999 }),
    ];

    const { result } = renderHook(() => useMetrics(leads, 5000, {}, 'custom', '2026-06-01', '2026-06-30'));

    expect(result.current.periodSummary.revenue).toBe(2500);
    expect(result.current.periodSummary.count).toBe(1);
  });

  it('includes archived leads in the previous-month chart even when not in active leads', () => {
    const leads: Lead[] = [];
    const archivedLeads = [
      makeLead('archived-july-1', { status: 'Fechado', statusChangedAt: '2026-06-15', value: 1200, archived: true }),
      makeLead('archived-july-2', { status: 'Fechado', statusChangedAt: '2026-06-20', value: 800, archived: true }),
    ];

    const { result } = renderHook(() => useMetrics(leads, 5000, {}, 'mes', null, null, archivedLeads));

    expect(result.current.monthlyEvolution.previousTotal).toBe(2000);
    expect(result.current.monthlyEvolution.previousCount).toBe(2);
  });

  it('does not double-count leads that appear in both active and archived snapshots', () => {
    const overlappingLead = makeLead('shared', { status: 'Fechado', statusChangedAt: '2026-06-15', value: 1500 });
    const leads = [overlappingLead];
    const archivedLeads = [makeLead('shared', { status: 'Fechado', statusChangedAt: '2026-06-15', value: 1500, archived: true })];

    const { result } = renderHook(() => useMetrics(leads, 5000, {}, 'mes', null, null, archivedLeads));

    expect(result.current.monthlyEvolution.previousTotal).toBe(1500);
    expect(result.current.monthlyEvolution.previousCount).toBe(1);
  });

  it('does not inflate active-lead stats with archived leads', () => {
    const activeLead = makeLead('active', { status: 'Fechado', statusChangedAt: '2026-07-02', value: 1000 });
    const archivedLeads = [
      makeLead('archived-prev', { status: 'Fechado', statusChangedAt: '2026-06-10', value: 2000, archived: true }),
    ];

    const { result } = renderHook(() => useMetrics([activeLead], 5000, {}, 'mes', null, null, archivedLeads));

    expect(result.current.stats.closed).toBe(1);
    expect(result.current.stats.total).toBe(1);
    expect(result.current.monthlyEvolution.previousTotal).toBe(2000);
  });
});
