import { describe, expect, it } from 'vitest';
import { buildMetricsPeriodRange } from '../../utils/metricsPeriod';

describe('buildMetricsPeriodRange', () => {
  const now = new Date('2026-07-02T09:00:00');

  it('mes spans from first day of month to today', () => {
    const range = buildMetricsPeriodRange('mes', null, null, now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-07-01');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-07-02');
    expect(range.label).toBe('Este mês');
  });

  it('7d includes the last 7 days (today minus 6)', () => {
    const range = buildMetricsPeriodRange('7d', null, null, now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-06-26');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-07-02');
    expect(range.label).toBe('Últimos 7 dias');
  });

  it('30d includes the last 30 days', () => {
    const range = buildMetricsPeriodRange('30d', null, null, now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-06-03');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-07-02');
  });

  it('90d includes the last 90 days', () => {
    const range = buildMetricsPeriodRange('90d', null, null, now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-04-04');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-07-02');
  });

  it('custom uses the provided start/end and builds a label', () => {
    const range = buildMetricsPeriodRange('custom', '2026-05-10', '2026-06-20', now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-05-10');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-06-20');
    expect(range.label).toBe('10/05/2026 a 20/06/2026');
  });

  it('custom reorders start/end when inverted', () => {
    const range = buildMetricsPeriodRange('custom', '2026-06-20', '2026-05-10', now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-05-10');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-06-20');
  });

  it('custom falls back to current month when dates are missing', () => {
    const range = buildMetricsPeriodRange('custom', null, null, now);
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-07-01');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-07-02');
  });
});
