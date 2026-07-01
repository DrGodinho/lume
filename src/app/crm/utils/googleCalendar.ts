import type { Lead } from '../types';
import { formatLeadCurrency } from '../utils';

const GOOGLE_CALENDAR_BASE_URL = 'https://calendar.google.com/calendar/render';

const DEFAULT_START_HOUR = 9;
const DEFAULT_DURATION_HOURS = 2;

const formatDateTimeCompact = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}` +
    `T` +
    `${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}Z`
  );
};

const buildDetails = (lead: Lead, formattedDate: string): string => {
  const lines: string[] = [
    `Cliente: ${lead.name}`,
    `Telefone: ${lead.phone || 'Não informado'}`,
    `Película: ${lead.filmType}`,
    `Metragem: ${lead.sqm.toFixed(2)} m²`,
    `Valor: R$ ${formatLeadCurrency(lead.value)}`,
    `Status: ${lead.status}`,
    `Data do serviço: ${formattedDate}`,
  ];

  if (lead.notes) {
    lines.push('', 'Observações:', lead.notes);
  }

  return lines.join('\n');
};

export interface BuildGoogleCalendarUrlOptions {
  durationHours?: number;
  startHourLocal?: number;
}

export const buildGoogleCalendarUrl = (
  lead: Lead,
  serviceDate: Date,
  options: BuildGoogleCalendarUrlOptions = {},
): string => {
  const durationHours = options.durationHours ?? DEFAULT_DURATION_HOURS;
  const startHourLocal = options.startHourLocal ?? DEFAULT_START_HOUR;

  const startDate = new Date(serviceDate);
  startDate.setHours(startHourLocal, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  const formattedDate = `${startDate.toLocaleDateString('pt-BR')} às ${startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Serviço: ${lead.name} - ${lead.filmType}`,
    dates: `${formatDateTimeCompact(startDate)}/${formatDateTimeCompact(endDate)}`,
    details: buildDetails(lead, formattedDate),
    location: lead.address || lead.neighborhood || 'Endereço não informado',
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
  });

  return `${GOOGLE_CALENDAR_BASE_URL}?${params.toString()}`;
};

export const openGoogleCalendarForLead = (
  lead: Lead,
  serviceDate: Date,
  options?: BuildGoogleCalendarUrlOptions,
): void => {
  if (typeof window === 'undefined') return;
  const url = buildGoogleCalendarUrl(lead, serviceDate, options);
  window.open(url, '_blank', 'noopener,noreferrer');
};
