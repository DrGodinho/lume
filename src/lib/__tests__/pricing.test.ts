import { describe, expect, it } from 'vitest';
import {
  calcCompensacaoPerda,
  calcEficiencia,
  calcFinalPrice,
  calcMetrosComprar,
  calcSubtotalBruto,
  calcTotalAreaM2,
  calcValorPraticoM2,
} from '../pricing';

describe('calcTotalAreaM2', () => {
  it('soma ow×oh e converte cm² → m²', () => {
    // 100×100cm = 1m² + 50×100cm = 0.5m²
    expect(calcTotalAreaM2([{ ow: 100, oh: 100 }, { ow: 50, oh: 100 }])).toBe(1.5);
  });

  it('lista vazia zera', () => {
    expect(calcTotalAreaM2([])).toBe(0);
  });
});

describe('calcSubtotalBruto', () => {
  it('multiplica área pelo preço', () => {
    expect(calcSubtotalBruto(1.5, 90)).toBe(135);
  });
});

describe('calcEficiencia', () => {
  it('calcula % de aproveitamento arredondada', () => {
    // 10000cm² usados em 200cm × 152cm de rolo ≈ 33%
    expect(calcEficiencia(200, 10000, 152)).toBe(33);
  });

  it('zera sem metragem', () => {
    expect(calcEficiencia(0, 10000, 152)).toBe(0);
  });
});

describe('calcCompensacaoPerda', () => {
  it('zera quando a compensação está desligada', () => {
    expect(calcCompensacaoPerda({
      compensarPerdas: false, modoPerdas: 'fixo', perdasFixas: 20, eficiencia: 50, subtotalBruto: 100,
    })).toBe(0);
  });

  it('modo fixo aplica o percentual sobre o bruto', () => {
    expect(calcCompensacaoPerda({
      compensarPerdas: true, modoPerdas: 'fixo', perdasFixas: 20, eficiencia: 50, subtotalBruto: 100,
    })).toBe(20);
  });

  it('modo dinâmico compensa o desperdício', () => {
    // eficiência 75% → compensa 25% de 200 = 50
    expect(calcCompensacaoPerda({
      compensarPerdas: true, modoPerdas: 'dinamico', perdasFixas: 20, eficiencia: 75, subtotalBruto: 200,
    })).toBe(50);
  });

  it('modo dinâmico zera nos extremos (0% ou ≥100%)', () => {
    const base = { compensarPerdas: true, modoPerdas: 'dinamico' as const, perdasFixas: 20, subtotalBruto: 200 };
    expect(calcCompensacaoPerda({ ...base, eficiencia: 0 })).toBe(0);
    expect(calcCompensacaoPerda({ ...base, eficiencia: 100 })).toBe(0);
    expect(calcCompensacaoPerda({ ...base, eficiencia: 120 })).toBe(0);
  });
});

describe('calcFinalPrice', () => {
  it('soma perdas, subtrai desconto e arredonda', () => {
    expect(calcFinalPrice(100, 20, 10)).toBe(110);
    expect(calcFinalPrice(100.005, 0, 0)).toBe(100.01);
  });
});

describe('calcValorPraticoM2', () => {
  it('divide o final pela área de vidro', () => {
    // R$110 em 10000cm² (1m²) = R$110/m²
    expect(calcValorPraticoM2(110, 10000)).toBe(110);
  });

  it('zera sem área', () => {
    expect(calcValorPraticoM2(110, 0)).toBe(0);
  });
});

describe('calcMetrosComprar', () => {
  it('converte cm → m', () => {
    expect(calcMetrosComprar(250)).toBe(2.5);
  });
});
