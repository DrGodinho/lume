import { format, parseISO, startOfDay, startOfMonth, subDays } from 'date-fns';

export const DEFAULT_METRICS_PERIOD = 'mes';

export const VALID_METRICS_PERIODS = ['mes', '7d', '30d', '90d', 'custom'] as const;

export type MetricsPeriod = (typeof VALID_METRICS_PERIODS)[number];

export const isMetricsPeriod = (value: unknown): value is MetricsPeriod =>
  typeof value === 'string' && (VALID_METRICS_PERIODS as readonly string[]).includes(value);

export interface MetricsPeriodRange {
  start: Date;
  end: Date;
  label: string;
  period: MetricsPeriod;
}

const parseDateOrNull = (value?: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const buildMetricsPeriodRange = (
  period: MetricsPeriod,
  customStart?: string | null,
  customEnd?: string | null,
  now: Date = new Date(),
): MetricsPeriodRange => {
  const today = startOfDay(now);

  switch (period) {
    case '7d':
      return { start: startOfDay(subDays(today, 6)), end: today, label: 'Últimos 7 dias', period };
    case '30d':
      return { start: startOfDay(subDays(today, 29)), end: today, label: 'Últimos 30 dias', period };
    case '90d':
      return { start: startOfDay(subDays(today, 89)), end: today, label: 'Últimos 90 dias', period };
    case 'custom': {
      const start = startOfDay(parseDateOrNull(customStart) || startOfMonth(now));
      const end = startOfDay(parseDateOrNull(customEnd) || now);
      const orderedStart = start <= end ? start : end;
      const orderedEnd = start <= end ? end : start;
      return {
        start: orderedStart,
        end: orderedEnd,
        label: `${format(orderedStart, 'dd/MM/yyyy')} a ${format(orderedEnd, 'dd/MM/yyyy')}`,
        period,
      };
    }
    case 'mes':
    default:
      return { start: startOfMonth(now), end: today, label: 'Este mês', period };
  }
};
