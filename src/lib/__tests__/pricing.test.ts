import { describe, expect, it } from 'vitest';
import {
  calcCompensacaoPerda,
  calcEficiencia,
  calcFinalPrice,
  calcMetrosComprar,
  calcSubtotalBruto,
  calcTotalAreaM2,
  calcValorPraticoM2,
  calcValorSelecionados,
  calcDescontoEmReais,
  converterDescontoEntreModos,
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

  it('modo dinâmico compensa a sobra real da bobina', () => {
    // eficiência 75% com proporção (100 - 75)/75 = 1/3 → 200 * (1/3) = 66.67
    expect(calcCompensacaoPerda({
      compensarPerdas: true, modoPerdas: 'dinamico', perdasFixas: 20, eficiencia: 75, subtotalBruto: 200,
    })).toBe(66.67);
  });

  it('modo dinâmico usa área exata da bobina quando fornecida', () => {
    // Área vidros 2m², bobina 3m², preço R$100/m² (subtotal R$200) -> sobra 1m² = R$100
    expect(calcCompensacaoPerda({
      compensarPerdas: true,
      modoPerdas: 'dinamico',
      perdasFixas: 20,
      eficiencia: 67,
      subtotalBruto: 200,
      totalAreaM2: 2,
      areaBobinaM2: 3,
      price: 100,
    })).toBe(100);
  });

  it('modo dinâmico respeita o teto de segurança de +100%', () => {
    // Eficiência 20% daria fator 4x (+400%). Com teto, limita a +100% (R$200)
    expect(calcCompensacaoPerda({
      compensarPerdas: true, modoPerdas: 'dinamico', perdasFixas: 20, eficiencia: 20, subtotalBruto: 200,
    })).toBe(200);
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

describe('calcValorSelecionados', () => {
  it('zera quando a área selecionada é 0', () => {
    expect(calcValorSelecionados({
      areaSelecionadaM2: 0,
      price: 100,
      compensarPerdas: true,
      modoPerdas: 'fixo',
      perdasFixas: 20,
      eficiencia: 80,
    })).toBe(0);
  });

  it('calcula valor bruto quando compensarPerdas está desligado', () => {
    expect(calcValorSelecionados({
      areaSelecionadaM2: 1.5,
      price: 100,
      compensarPerdas: false,
      modoPerdas: 'fixo',
      perdasFixas: 20,
      eficiencia: 80,
    })).toBe(150);
  });

  it('aplica perdas fixas quando ativado', () => {
    // 2m² a R$100 = 200 + 20% perda = 240
    expect(calcValorSelecionados({
      areaSelecionadaM2: 2,
      price: 100,
      compensarPerdas: true,
      modoPerdas: 'fixo',
      perdasFixas: 20,
      eficiencia: 80,
    })).toBe(240);
  });

  it('aplica perdas dinâmicas baseadas na eficiência', () => {
    // 2m² a R$100 = 200, eficiência 75% -> sobra real de bobina (100-75)/75 = 1/3 (+33.33%) -> 200 + 66.67 = 266.67
    expect(calcValorSelecionados({
      areaSelecionadaM2: 2,
      price: 100,
      compensarPerdas: true,
      modoPerdas: 'dinamico',
      perdasFixas: 20,
      eficiencia: 75,
    })).toBe(266.67);
  });

  it('não adiciona perdas dinâmicas se eficiência for 100%', () => {
    expect(calcValorSelecionados({
      areaSelecionadaM2: 2,
      price: 100,
      compensarPerdas: true,
      modoPerdas: 'dinamico',
      perdasFixas: 20,
      eficiencia: 100,
    })).toBe(200);
  });
});

describe('calcDescontoEmReais', () => {
  it('retorna 0 para inputs zerados, negativos ou bases inválidas', () => {
    expect(calcDescontoEmReais('real', 0, 1000)).toBe(0);
    expect(calcDescontoEmReais('real', -50, 1000)).toBe(0);
    expect(calcDescontoEmReais('porcentagem', 0, 1000)).toBe(0);
    expect(calcDescontoEmReais('porcentagem', 10, 0)).toBe(0);
  });

  it('no modo real, limita o desconto à base total', () => {
    expect(calcDescontoEmReais('real', 150, 1000)).toBe(150);
    expect(calcDescontoEmReais('real', 1200, 1000)).toBe(1000);
  });

  it('no modo porcentagem, calcula percentual correto sobre a base com perdas', () => {
    // 10% de R$ 1500 = R$ 150
    expect(calcDescontoEmReais('porcentagem', 10, 1500)).toBe(150);
    // 5.5% de R$ 2000 = R$ 110
    expect(calcDescontoEmReais('porcentagem', 5.5, 2000)).toBe(110);
    // Limita a 100%
    expect(calcDescontoEmReais('porcentagem', 120, 1000)).toBe(1000);
  });
});

describe('converterDescontoEntreModos', () => {
  it('converte de R$ para % corretamente', () => {
    // R$ 150 de R$ 1500 = 10%
    expect(converterDescontoEntreModos('porcentagem', 150, 1500)).toBe(10);
    // R$ 250 de R$ 1000 = 25%
    expect(converterDescontoEntreModos('porcentagem', 250, 1000)).toBe(25);
  });

  it('converte de % para R$ corretamente', () => {
    // 10% de R$ 1500 = R$ 150
    expect(converterDescontoEntreModos('real', 10, 1500)).toBe(150);
  });

  it('retorna 0 se base for 0', () => {
    expect(converterDescontoEntreModos('porcentagem', 100, 0)).toBe(0);
    expect(converterDescontoEntreModos('real', 10, 0)).toBe(0);
  });
});


