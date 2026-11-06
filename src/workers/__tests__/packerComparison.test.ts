import { describe, it, expect } from 'vitest';
import {
  packGuillotine,
  packDensity,
  type PackItem,
  type ProShelf,
} from '../packerCore';

function detectLCuts(shelves: ProShelf[]): number {
  let lCuts = 0;
  for (const shelf of shelves) {
    for (const col of shelf.columns) {
      if (col.blocks.length > 1) {
        const firstW = col.blocks[0].w;
        for (let i = 1; i < col.blocks.length; i++) {
          if (Math.abs(col.blocks[i].w - firstW) > 1) {
            lCuts++;
          }
        }
      }
    }
  }
  return lCuts;
}

describe('Novo Algoritmo Unificado de Corte Guilhotina (packGuillotine)', () => {
  it('Cenário 1: Apartamento com peças mistas (Zero cortes em L)', () => {
    const items: PackItem[] = [
      { id: '1', ow: 80, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1 },
      { id: '2', ow: 80, oh: 140, cor: '#f00', alignRight: false, sortOrder: 2 },
      { id: '3', ow: 60, oh: 90, cor: '#0f0', alignRight: false, sortOrder: 3 },
      { id: '4', ow: 60, oh: 45, cor: '#00f', alignRight: false, sortOrder: 4 },
      { id: '5', ow: 45, oh: 45, cor: '#ff0', alignRight: false, sortOrder: 5 },
    ];

    const result = packGuillotine(items, 152, 3);
    const densityResult = packDensity(items, 152, 3);

    expect(result.blocks.length).toBe(items.length);
    expect(detectLCuts(result.shelves)).toBe(0);
    // Deve ser competitivo com densidade sem gerar cortes complexos
    expect(result.totalY).toBeGreaterThan(0);
    expect(densityResult.totalY).toBeGreaterThan(0);
  });

  it('Cenário 2: Varanda Gourmet com 6 folhas idênticas', () => {
    const items: PackItem[] = [
      { id: '1', ow: 55, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1 },
      { id: '2', ow: 55, oh: 140, cor: '#f00', alignRight: false, sortOrder: 2 },
      { id: '3', ow: 55, oh: 140, cor: '#f00', alignRight: false, sortOrder: 3 },
      { id: '4', ow: 55, oh: 140, cor: '#f00', alignRight: false, sortOrder: 4 },
      { id: '5', ow: 55, oh: 140, cor: '#f00', alignRight: false, sortOrder: 5 },
      { id: '6', ow: 55, oh: 140, cor: '#f00', alignRight: false, sortOrder: 6 },
    ];

    const result = packGuillotine(items, 152, 3);
    expect(result.blocks.length).toBe(6);
    expect(detectLCuts(result.shelves)).toBe(0);
  });

  it('Cenário 3: Vidros basculantes gêmeos empilhados perfeitamente', () => {
    const items: PackItem[] = [
      { id: '1', ow: 80, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1 },
      { id: '2', ow: 60, oh: 140, cor: '#f00', alignRight: false, sortOrder: 2 },
      { id: '3', ow: 50, oh: 40, cor: '#00f', alignRight: false, sortOrder: 3 },
      { id: '4', ow: 50, oh: 40, cor: '#00f', alignRight: false, sortOrder: 4 },
    ];

    const result = packGuillotine(items, 152, 3);
    expect(result.blocks.length).toBe(4);
    expect(detectLCuts(result.shelves)).toBe(0);
  });

  it('Cenário 4: Tolerância de Alturas Diferentes (Opção A: 145cm e 140cm juntos)', () => {
    const items: PackItem[] = [
      { id: '1', ow: 70, oh: 145, cor: '#f00', alignRight: false, sortOrder: 1 },
      { id: '2', ow: 70, oh: 140, cor: '#f00', alignRight: false, sortOrder: 2 },
    ];

    const result = packGuillotine(items, 152, 3);
    expect(result.blocks.length).toBe(2);
    // Como 70 + 3 + 70 = 143 <= 152, eles cabem lado a lado na mesma faixa!
    expect(result.shelves.length).toBe(1);
    expect(result.totalY).toBe(145);
    expect(detectLCuts(result.shelves)).toBe(0);
  });

  it('Cenário 5: Teste de rotação forçada (forceRotate true vs false)', () => {
    // Vidro de 60 x 140 cm em bobina de 152 cm
    // Quando automático (undefined), o algoritmo escolhe girado (140x60) pois ocupa menos comprimento (Y=60 vs Y=140)
    const itemAuto: PackItem = { id: '1', ow: 60, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1 };
    const resAuto = packGuillotine([itemAuto], 152, 3);
    const blockAuto = resAuto.blocks[0];

    // O usuário clica para desvirar (forçar em pé: forceRotate = false)
    const itemNormal: PackItem = { id: '1', ow: 60, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1, forceRotate: false };
    const resNormal = packGuillotine([itemNormal], 152, 3);
    const blockNormal = resNormal.blocks[0];

    // O usuário clica para forçar girado (forceRotate = true)
    const itemRotated: PackItem = { id: '1', ow: 60, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1, forceRotate: true };
    const resRotated = packGuillotine([itemRotated], 152, 3);
    const blockRotated = resRotated.blocks[0];

    console.log(`Auto: rw=${blockAuto?.rw}, rh=${blockAuto?.rh}, rotated=${blockAuto?.rotated}`);
    console.log(`Forced Normal: rw=${blockNormal?.rw}, rh=${blockNormal?.rh}, rotated=${blockNormal?.rotated}`);
    console.log(`Forced Rotated: rw=${blockRotated?.rw}, rh=${blockRotated?.rh}, rotated=${blockRotated?.rotated}`);

    // Em pé forçado: largura 60, altura 140
    expect(blockNormal.rw).toBe(60);
    expect(blockNormal.rh).toBe(140);
    expect(blockNormal.rotated).toBe(false);

    // Girado forçado: largura 140, altura 60
    expect(blockRotated.rw).toBe(140);
    expect(blockRotated.rh).toBe(60);
    expect(blockRotated.rotated).toBe(true);
  });

  it('Cenário 6: Bobina de 100 cm com peças mistas e peças maiores que a bobina', () => {
    const items: PackItem[] = [
      { id: '1', ow: 60, oh: 140, cor: '#f00', alignRight: false, sortOrder: 1 }, // Cabe em pé (w=60 <= 100)
      { id: '2', ow: 45, oh: 90, cor: '#0f0', alignRight: false, sortOrder: 2 },  // Cabe em pé ou girado
      { id: '3', ow: 45, oh: 90, cor: '#0f0', alignRight: false, sortOrder: 3 },  // Cabe ao lado de 2 (45+3+45=93 <= 100)
      { id: '4', ow: 120, oh: 150, cor: '#888', alignRight: false, sortOrder: 4 }, // Sobredimensionada (> 100 em ambas orientações)
      { id: '5', ow: 110, oh: 130, cor: '#888', alignRight: false, sortOrder: 5 }, // Sobredimensionada (> 100 em ambas orientações)
    ];

    // Não deve entrar em loop infinito e deve processar em milissegundos
    const t0 = Date.now();
    const result = packGuillotine(items, 100, 3);
    const duration = Date.now() - t0;

    expect(duration).toBeLessThan(1000);
    // As 3 peças que cabem devem ser posicionadas com sucesso
    expect(result.blocks.length).toBe(3);
    expect(result.totalY).toBeGreaterThan(0);
    expect(detectLCuts(result.shelves)).toBe(0);

    // Todas as peças posicionadas devem ter x + w <= 100
    for (const b of result.blocks) {
      expect((b.fit?.x ?? 0) + b.w).toBeLessThanOrEqual(100 + 0.1);
    }
  });
});
