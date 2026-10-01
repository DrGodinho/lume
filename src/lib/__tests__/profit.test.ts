import { describe, expect, it } from 'vitest';
import { calcLucroCalculadora } from '../pricing';

describe('calcLucroCalculadora', () => {
  it('calcula custo para película vendida ao metro inteiro', () => {
    // Ex: Precisa de 3.2m de Window Blue. Preço de venda R$ 1.500. Custo R$ 130/m.
    // Metros mínimos = ceil(3.2) = 4m.
    // Custo filme = 4 * 130 = 520.
    // Lucro = 1500 - 520 = 980.
    // Margem = (980 / 1500) * 100 = 65.3%
    const res = calcLucroCalculadora({
      finalPrice: 1500,
      metrosComprar: 3.2,
      priceCost: 130,
      purchaseType: 'metro',
    });

    expect(res.metrosMinimosCompra).toBe(4);
    expect(res.quantidadeLotes).toBe(4);
    expect(res.custoFilme).toBe(520);
    expect(res.custoAjudante).toBe(0);
    expect(res.custoTotal).toBe(520);
    expect(res.lucroLiquido).toBe(980);
    expect(res.margemPercentual).toBe(65.3);
  });

  it('calcula custo para película vendida em lotes de 7.5m (1/4 de rolo)', () => {
    // Ex: Precisa de 3.2m de Nano Carbono. Preço de venda R$ 800. Custo R$ 250 por lote de 7.5m.
    // Lotes = ceil(3.2 / 7.5) = 1 lote de 7.5m.
    // Custo filme = 1 * 250 = 250.
    // Lucro = 800 - 250 = 550.
    // Margem = (550 / 800) * 100 = 68.8%
    const res = calcLucroCalculadora({
      finalPrice: 800,
      metrosComprar: 3.2,
      priceCost: 250,
      purchaseType: 'bloco_7_5m',
    });

    expect(res.metrosMinimosCompra).toBe(7.5);
    expect(res.quantidadeLotes).toBe(1);
    expect(res.custoFilme).toBe(250);
    expect(res.lucroLiquido).toBe(550);
    expect(res.margemPercentual).toBe(68.8);
  });

  it('calcula múltiplos lotes de 7.5m quando ultrapassa 7.5m', () => {
    // Ex: Precisa de 8.1m de Nano Carbono. Preço de venda R$ 1.800. Custo R$ 250/lote.
    // Lotes = ceil(8.1 / 7.5) = 2 lotes (15m).
    // Custo = 2 * 250 = 500.
    // Lucro = 1800 - 500 = 1300.
    const res = calcLucroCalculadora({
      finalPrice: 1800,
      metrosComprar: 8.1,
      priceCost: 250,
      purchaseType: 'bloco_7_5m',
    });

    expect(res.metrosMinimosCompra).toBe(15);
    expect(res.quantidadeLotes).toBe(2);
    expect(res.custoFilme).toBe(500);
    expect(res.lucroLiquido).toBe(1300);
  });

  it('zera o custo do filme quando usarSobra for true', () => {
    // Se está usando sobra de estoque de obra anterior, o custo do filme é zero
    const res = calcLucroCalculadora({
      finalPrice: 1200,
      metrosComprar: 4.5,
      priceCost: 150,
      purchaseType: 'metro',
      usarSobra: true,
    });

    expect(res.custoFilme).toBe(0);
    expect(res.metrosMinimosCompra).toBe(0);
    expect(res.custoTotal).toBe(0);
    expect(res.lucroLiquido).toBe(1200);
    expect(res.margemPercentual).toBe(100);
  });

  it('inclui custo de ajudante no custo total e desconta do lucro', () => {
    // Venda 1500, filme 520, ajudante 200
    // Custo total = 720. Lucro = 780. Margem = (780 / 1500) * 100 = 52.0%
    const res = calcLucroCalculadora({
      finalPrice: 1500,
      metrosComprar: 3.2,
      priceCost: 130,
      purchaseType: 'metro',
      custoAjudante: 200,
    });

    expect(res.custoFilme).toBe(520);
    expect(res.custoAjudante).toBe(200);
    expect(res.custoTotal).toBe(720);
    expect(res.lucroLiquido).toBe(780);
    expect(res.margemPercentual).toBe(52);
  });

  it('protege contra finalPrice zero sem erro de divisão', () => {
    const res = calcLucroCalculadora({
      finalPrice: 0,
      metrosComprar: 0,
      priceCost: 100,
      purchaseType: 'metro',
    });

    expect(res.custoTotal).toBe(0);
    expect(res.lucroLiquido).toBe(0);
    expect(res.margemPercentual).toBe(0);
  });
});
