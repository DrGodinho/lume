import { describe, expect, it, vi } from 'vitest';
import {
  formatServiceDateTimeValue,
  getLeadServiceDate,
  getWhatsAppTemplateText,
  parseLeadServiceTime,
  syncServiceTimeInNotes,
} from '../useAgenda';
import { buildGoogleCalendarUrl } from '../../utils/googleCalendar';
import type { Lead } from '../../types';

const baseLead: Lead = {
  id: 'lead-time-1',
  name: 'Juliana Mendes',
  phone: '21988887777',
  email: 'juliana@example.com',
  address: 'Rua das Palmeiras 120',
  neighborhood: 'Ipanema',
  filmType: 'Nanocerâmica',
  sqm: 12,
  value: 2000,
  status: 'Agendado',
  statusChangedAt: '2026-10-01',
  dataServico: '2026-10-15T14:30:00',
  serviceStatus: 'Marcado',
  proximoContato: null,
  dormant: false,
  pinned: false,
  notes: 'Sem restrições',
  createdAt: '2026-10-01',
  updatedAt: '2026-10-01',
};

describe('Service Installation Time Helpers', () => {
  it('parses time from dataServico ISO string', () => {
    expect(parseLeadServiceTime('2026-10-15T14:30:00', '')).toBe('14:30');
    expect(parseLeadServiceTime('2026-10-15T09:00:00', '')).toBe('09:00');
    expect(parseLeadServiceTime('2026-10-15T00:00:00', '')).toBe('');
    expect(parseLeadServiceTime('2026-10-15', '')).toBe('');
  });

  it('parses time fallback from notes tag [Horário: HH:mm]', () => {
    expect(parseLeadServiceTime('2026-10-15', 'Instalar pela manhã [Horário: 09:45]')).toBe('09:45');
    expect(parseLeadServiceTime('2026-10-15', '[Horario: 16:00]')).toBe('16:00');
    expect(parseLeadServiceTime('2026-10-15', 'Sem horário definido')).toBe('');
  });

  it('formats combined date and time for service scheduling', () => {
    expect(formatServiceDateTimeValue('2026-10-15', '14:30')).toBe('2026-10-15T14:30:00');
    expect(formatServiceDateTimeValue('2026-10-15T00:00:00', '09:00')).toBe('2026-10-15T09:00:00');
    expect(formatServiceDateTimeValue('2026-10-15', '')).toBe('2026-10-15');
    expect(formatServiceDateTimeValue('2026-10-15', null)).toBe('2026-10-15');
    expect(formatServiceDateTimeValue(null, '14:30')).toBeNull();
  });

  it('synchronizes [Horário: HH:mm] tag in notes', () => {
    const note1 = syncServiceTimeInNotes('Cliente prefere após o almoço', '14:30');
    expect(note1).toContain('[Horário: 14:30]');

    // Updating time replaces the existing tag
    const note2 = syncServiceTimeInNotes(note1, '15:00');
    expect(note2).toContain('[Horário: 15:00]');
    expect(note2).not.toContain('[Horário: 14:30]');

    // Clearing time removes the tag
    const note3 = syncServiceTimeInNotes(note2, '');
    expect(note3).not.toContain('[Horário:');
    expect(note3).toContain('Cliente prefere após o almoço');
  });

  it('getLeadServiceDate creates Date with correct hours and minutes', () => {
    const serviceDate = getLeadServiceDate(baseLead);
    expect(serviceDate).not.toBeNull();
    expect(serviceDate!.getHours()).toBe(14);
    expect(serviceDate!.getMinutes()).toBe(30);

    // With notes fallback
    const leadWithNotes: Lead = {
      ...baseLead,
      dataServico: '2026-10-20',
      notes: 'Confirmado [Horário: 10:15]',
    };
    const dateFromNotes = getLeadServiceDate(leadWithNotes);
    expect(dateFromNotes).not.toBeNull();
    expect(dateFromNotes!.getHours()).toBe(10);
    expect(dateFromNotes!.getMinutes()).toBe(15);
  });

  it('generates Google Calendar URL with exact scheduled time', () => {
    const serviceDate = getLeadServiceDate(baseLead)!;
    const url = buildGoogleCalendarUrl(baseLead, serviceDate, { durationHours: 2 });
    expect(url).toContain('https://calendar.google.com/calendar/render?');
    expect(url).toContain('14%3A30'); // encoded "14:30" in formattedDate or details
  });

  it('includes installation time in WhatsApp confirmation message', () => {
    const textWithTime = getWhatsAppTemplateText(baseLead, 'servico');
    expect(textWithTime).toContain('às 14:30');

    const leadWithoutTime: Lead = {
      ...baseLead,
      dataServico: '2026-10-15',
      notes: '',
    };
    const textWithoutTime = getWhatsAppTemplateText(leadWithoutTime, 'servico');
    expect(textWithoutTime).not.toContain('às ');
    expect(textWithoutTime).toContain('agendado para');
  });
});
