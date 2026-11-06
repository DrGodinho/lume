import {
  normalizeItems,
  packDensity,
  packGuillotine,
  type WorkerPayload,
} from './packerCore';

/**
 * Web Worker para cálculo de corte de película.
 *
 * MODOS SUPORTADOS:
 * 1. 'densidade': Máximo aproveitamento em 2D (menor metro linear possível).
 * 2. 'facilidade' / 'facilidade_v2': Novo algoritmo unificado de Corte Prático (Guilhotina 2-Stage sem cortes em L).
 *    Ambos os identificadores chamam `packGuillotine` para garantir 100% de compatibilidade
 *    com orçamentos legados salvos no banco de dados e rascunhos.
 */
self.onmessage = (event: MessageEvent<WorkerPayload>) => {
  const { vidros, rollW, margin, modoOtimizacao, agressividadeCorte = 35 } = event.data;
  const items = normalizeItems(vidros);

  if (modoOtimizacao === 'densidade') {
    const packed = packDensity(items, rollW, margin);
    self.postMessage({ blocos: packed.blocks, maxY: packed.totalY, areaV: packed.areaV });
    return;
  }

  // Modo Prático / Guilhotina Unificado (substitui v1 e v2 com cortes retos sem entalhes em L)
  const packed = packGuillotine(items, rollW, margin, agressividadeCorte);
  self.postMessage({ blocos: packed.blocks, maxY: packed.totalY, areaV: packed.areaV });
};
