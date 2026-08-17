import { describe, expect, it } from 'vitest';
import { leadFormSchema, leadPayloadSchema, normalizeLeadPhoneInput } from '../../schemas/leadSchema';

const validForm = {
  name: 'Cliente Teste',
  phone: '21999999999',
  email: '',
  address: 'Rua A',
  neighborhood: 'Bangu',
  filmType: 'Nano Ceramica',
  sqm: 10,
  value: 500,
  status: 'Novo' as const,
  notes: '',
  statusChangedAt: '2026-07-01',
  dataServico: null,
  serviceStatus: null,
  proximoContato: null,
  dormant: false,
  pinned: false,
};

describe('leadFormSchema', () => {
  it('accepts a valid lead form', () => {
    const result = leadFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it('rejects a name with fewer than 2 characters', () => {
    const result = leadFormSchema.safeParse({ ...validForm, name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('Nome'))).toBe(true);
    }
  });

  it('accepts an empty phone but rejects a malformed one', () => {
    expect(leadFormSchema.safeParse({ ...validForm, phone: '' }).success).toBe(true);
    const invalid = leadFormSchema.safeParse({ ...validForm, phone: '2199-9999' });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues.some((issue) => issue.path[0] === 'phone')).toBe(true);
    }
  });

  it('accepts flexible phone formats (+55, parens, dashes, spaces)', () => {
    expect(leadFormSchema.safeParse({ ...validForm, phone: '+5521999999999' }).success).toBe(true);
    expect(leadFormSchema.safeParse({ ...validForm, phone: '+55 21 99999-9999' }).success).toBe(true);
    expect(leadFormSchema.safeParse({ ...validForm, phone: '(21) 99999-9999' }).success).toBe(true);
    expect(leadFormSchema.safeParse({ ...validForm, phone: '21-99999-9999' }).success).toBe(true);
    expect(leadFormSchema.safeParse({ ...validForm, phone: '21 9999 9999' }).success).toBe(true);
  });

  it('rejects phone with too few digits even if formatted', () => {
    const invalid = leadFormSchema.safeParse({ ...validForm, phone: '+55 21 999-99' });
    expect(invalid.success).toBe(false);
  });

  it('normalizes phone input by stripping non-digits and leading 55', () => {
    expect(normalizeLeadPhoneInput('+5521999999999')).toBe('21999999999');
    expect(normalizeLeadPhoneInput('+55 21 99999-9999')).toBe('21999999999');
    expect(normalizeLeadPhoneInput('(21) 99999-9999')).toBe('21999999999');
    expect(normalizeLeadPhoneInput('21-99999-9999')).toBe('21999999999');
    expect(normalizeLeadPhoneInput('21999999999')).toBe('21999999999');
    expect(normalizeLeadPhoneInput('')).toBe('');
  });

  it('rejects an invalid email', () => {
    const result = leadFormSchema.safeParse({ ...validForm, email: 'nao-e-um-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'email')).toBe(true);
    }
  });

  it('rejects sqm <= 0 in the strict form schema', () => {
    expect(leadFormSchema.safeParse({ ...validForm, sqm: 0 }).success).toBe(false);
    expect(leadFormSchema.safeParse({ ...validForm, sqm: -1 }).success).toBe(false);
  });

  it('rejects a negative value', () => {
    const result = leadFormSchema.safeParse({ ...validForm, value: -10 });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown status', () => {
    const result = leadFormSchema.safeParse({ ...validForm, status: 'Arquivado' });
    expect(result.success).toBe(false);
  });
});

describe('leadPayloadSchema (API normalized payload)', () => {
  const validPayload = {
    ...validForm,
    id: 'lead_1',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01T09:00:00.000Z',
    deletedAt: null,
  };

  it('accepts a normalized payload with extra fields', () => {
    expect(leadPayloadSchema.safeParse(validPayload).success).toBe(true);
  });

  it('tolerates sqm = 0 (backward compat with existing/legacy leads)', () => {
    expect(leadPayloadSchema.safeParse({ ...validPayload, sqm: 0 }).success).toBe(true);
  });

  it('still rejects malformed phone and invalid email', () => {
    expect(leadPayloadSchema.safeParse({ ...validPayload, phone: 'abc' }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...validPayload, email: 'abc' }).success).toBe(false);
  });
});
