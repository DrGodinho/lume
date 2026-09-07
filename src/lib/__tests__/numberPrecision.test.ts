import { describe, expect, it } from 'vitest';
import { roundCurrency, roundMeasure, roundTo } from '../numberPrecision';

describe('roundTo', () => {
  it('arredonda para as casas pedidas', () => {
    expect(roundTo(1.234, 2)).toBe(1.23);
    expect(roundTo(1.235, 2)).toBe(1.24);
    expect(roundTo(10.5, 0)).toBe(11);
  });

  it('corrige o clássico 0.1 + 0.2', () => {
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
  });

  it('zera entradas inválidas em vez de espalhar NaN', () => {
    expect(roundTo(NaN, 2)).toBe(0);
    expect(roundTo(Infinity, 2)).toBe(0);
    expect(roundTo(undefined, 2)).toBe(0);
    expect(roundTo('abc', 2)).toBe(0);
  });

  it('aceita numérico em string', () => {
    expect(roundTo('12.345', 2)).toBe(12.35);
  });
});

describe('roundCurrency / roundMeasure', () => {
  it('arredonda moeda em centavos', () => {
    expect(roundCurrency(1234.567)).toBe(1234.57);
    expect(roundCurrency(100)).toBe(100);
  });

  it('arredonda medida em 2 casas', () => {
    expect(roundMeasure(2.3456)).toBe(2.35);
  });
});
