import { describe, expect, it } from 'vitest';
import {
  parseBrazilianNumber,
  parseLeadExpenses,
  formatExpensesTag,
  mergeExpensesIntoNotes,
} from '../expenses';

describe('expenses utility', () => {
  describe('parseBrazilianNumber', () => {
    it('handles numeric and string values in various Brazilian currency formats', () => {
      expect(parseBrazilianNumber(150)).toBe(150);
      expect(parseBrazilianNumber('150')).toBe(150);
      expect(parseBrazilianNumber('150,00')).toBe(150);
      expect(parseBrazilianNumber('150.00')).toBe(150);
      expect(parseBrazilianNumber('1.250,50')).toBe(1250.5);
      expect(parseBrazilianNumber('R$ 200,00')).toBe(200);
      expect(parseBrazilianNumber(null)).toBe(0);
      expect(parseBrazilianNumber(undefined)).toBe(0);
      expect(parseBrazilianNumber('abc')).toBe(0);
    });
  });

  describe('parseLeadExpenses', () => {
    it('returns 0 when notes is empty or undefined', () => {
      expect(parseLeadExpenses(null)).toEqual({ custoAjudante: 0, outrasDespesas: 0 });
      expect(parseLeadExpenses('')).toEqual({ custoAjudante: 0, outrasDespesas: 0 });
      expect(parseLeadExpenses('Observações normais sem despesas')).toEqual({ custoAjudante: 0, outrasDespesas: 0 });
    });

    it('extracts both ajudante and extras from composite tag', () => {
      const notes = 'Cliente confirmou instalação.\n[Despesas: Ajudante R$ 150,00 | Extras R$ 45,50]';
      const result = parseLeadExpenses(notes);
      expect(result.custoAjudante).toBe(150);
      expect(result.outrasDespesas).toBe(45.5);
    });

    it('extracts ajudante when only ajudante is present in tag', () => {
      const notes = '[Despesas: Ajudante R$ 200,00]';
      const result = parseLeadExpenses(notes);
      expect(result.custoAjudante).toBe(200);
      expect(result.outrasDespesas).toBe(0);
    });

    it('handles legacy standalone tags', () => {
      expect(parseLeadExpenses('[Ajudante: R$ 180,00]').custoAjudante).toBe(180);
      expect(parseLeadExpenses('[Custo Ajudante: R$ 120]').custoAjudante).toBe(120);
      expect(parseLeadExpenses('[Extras: R$ 35,00]').outrasDespesas).toBe(35);
    });
  });

  describe('formatExpensesTag', () => {
    it('formats composite tag when both are present', () => {
      expect(formatExpensesTag(150, 45)).toBe('[Despesas: Ajudante R$ 150,00 | Extras R$ 45,00]');
    });

    it('formats single ajudante tag', () => {
      expect(formatExpensesTag(150, 0)).toBe('[Despesas: Ajudante R$ 150,00]');
    });

    it('formats single extras tag', () => {
      expect(formatExpensesTag(0, 30)).toBe('[Despesas: Extras R$ 30,00]');
    });

    it('returns empty string when both are 0', () => {
      expect(formatExpensesTag(0, 0)).toBe('');
    });
  });

  describe('mergeExpensesIntoNotes', () => {
    it('appends expenses tag to existing notes', () => {
      const result = mergeExpensesIntoNotes('Vidro temperado 8mm', 150, 20);
      expect(result).toContain('Vidro temperado 8mm');
      expect(result).toContain('[Despesas: Ajudante R$ 150,00 | Extras R$ 20,00]');
    });

    it('replaces existing expenses tag without duplicating', () => {
      const initial = 'Vidro temperado 8mm\n[Despesas: Ajudante R$ 150,00]';
      const updated = mergeExpensesIntoNotes(initial, 200, 50);
      expect(updated).not.toContain('Ajudante R$ 150,00');
      expect(updated).toContain('[Despesas: Ajudante R$ 200,00 | Extras R$ 50,00]');
    });

    it('appends completion note when provided', () => {
      const result = mergeExpensesIntoNotes('Notas iniciais', 100, 0, 'Instalação concluída com sucesso');
      expect(result).toContain('Notas iniciais');
      expect(result).toContain('Conclusão] Instalação concluída com sucesso');
      expect(result).toContain('[Despesas: Ajudante R$ 100,00]');
    });
  });
});
