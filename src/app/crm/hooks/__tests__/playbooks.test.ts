import { describe, expect, it } from 'vitest';
import { applyFollowUpPlaybook, createDefaultPlaybookRules, getPlaybookFollowUpDate } from '../../utils/playbooks';
import type { Lead } from '../../types';

const lead: Lead = {
  id: 'lead_1',
  name: 'Cliente Teste',
  phone: '21999999999',
  email: '',
  address: 'Rua A',
  neighborhood: 'Bangu',
  filmType: 'Nano Ceramica',
  sqm: 10,
  value: 500,
  status: 'Novo',
  createdAt: '2026-07-01',
  statusChangedAt: '2026-07-01',
  notes: '',
  dormant: false,
};

describe('follow-up playbooks', () => {
  it('schedules a Novo lead for D+2 by default', () => {
    const result = applyFollowUpPlaybook(lead, createDefaultPlaybookRules(), {
      baseDate: new Date('2026-07-01T09:00:00'),
    });

    expect(result.proximoContato).toMatch(/^2026-07-03T/);
  });

  it('keeps a manually selected follow-up date by default', () => {
    const manualDate = '2026-07-10T12:00:00.000Z';
    const result = applyFollowUpPlaybook(
      { ...lead, proximoContato: manualDate },
      createDefaultPlaybookRules(),
      { baseDate: new Date('2026-07-01T09:00:00') },
    );

    expect(result.proximoContato).toBe(manualDate);
  });

  it('does not schedule when the matching rule is disabled', () => {
    const rules = createDefaultPlaybookRules().map((rule) => (
      rule.triggerStatus === 'Novo' ? { ...rule, enabled: false } : rule
    ));
    const result = applyFollowUpPlaybook(lead, rules, {
      baseDate: new Date('2026-07-01T09:00:00'),
    });

    expect(result.proximoContato).toBeUndefined();
  });

  it('returns a server-ready follow-up date for a status', () => {
    const result = getPlaybookFollowUpDate('Em Contato', null, createDefaultPlaybookRules(), {
      baseDate: new Date('2026-07-01T09:00:00'),
    });

    expect(result).toMatch(/^2026-07-08T/);
  });

  it('overwrites an existing follow-up when requested by a future status change', () => {
    const result = getPlaybookFollowUpDate('Agendado', '2026-07-02T12:00:00.000Z', createDefaultPlaybookRules(), {
      baseDate: new Date('2026-07-01T09:00:00'),
      overwriteExisting: true,
    });

    expect(result).toMatch(/^2026-07-16T/);
  });
});
