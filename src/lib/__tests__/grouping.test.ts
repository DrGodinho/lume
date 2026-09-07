import { describe, expect, it } from 'vitest';
import { groupByAmbiente, roomGroupKey, SEM_AMBIENTE_LABEL } from '../grouping';

describe('roomGroupKey', () => {
  it('usa o label quando preenchido', () => {
    expect(roomGroupKey('Sala')).toBe('Sala');
  });

  it('cai em "Sem Ambiente" quando vazio', () => {
    expect(roomGroupKey('')).toBe(SEM_AMBIENTE_LABEL);
    expect(roomGroupKey(undefined)).toBe(SEM_AMBIENTE_LABEL);
  });
});

describe('groupByAmbiente', () => {
  it('agrupa por label', () => {
    const itens = [
      { h: 100, w: 50, q: 1, label: 'Sala' },
      { h: 80, w: 40, q: 2, label: 'Quarto' },
      { h: 60, w: 30, q: 1, label: 'Sala' },
    ];
    const grupos = groupByAmbiente(itens);
    expect(Object.keys(grupos).sort()).toEqual(['Quarto', 'Sala']);
    expect(grupos['Sala']).toHaveLength(2);
    expect(grupos['Quarto']).toHaveLength(1);
  });

  it('label vazio cai em "Sem Ambiente"', () => {
    const grupos = groupByAmbiente([{ h: 10, w: 10, q: 1, label: '' }]);
    expect(grupos[SEM_AMBIENTE_LABEL]).toHaveLength(1);
  });

  it('lista vazia retorna objeto vazio', () => {
    expect(groupByAmbiente([])).toEqual({});
  });
});
