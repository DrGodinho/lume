import { describe, expect, it } from 'vitest';
import { formatBRL, formatNumber2 } from '../money';

describe('formatNumber2', () => {
  it('formata com 2 casas no padrão pt-BR', () => {
    expect(formatNumber2(1234.5)).toBe('1.234,50');
    expect(formatNumber2(0)).toBe('0,00');
  });

  it('nunca retorna NaN/Infinity como texto', () => {
    expect(formatNumber2(NaN)).toBe('0,00');
    expect(formatNumber2(Infinity)).toBe('0,00');
  });
});

describe('formatBRL', () => {
  it('inclui o símbolo do real', () => {
    const texto = formatBRL(1234.56).replace(/\u00a0/g, ' ');
    expect(texto).toContain('R$');
    expect(texto).toContain('1.234,56');
  });
});
