export type OptimizationMode = 'densidade' | 'facilidade' | 'facilidade_v2';

export interface InputGlass {
  id: string;
  ow: number;
  oh: number;
  cor: string;
  label?: string;
  forceRotate?: boolean;
  alignRight?: boolean;
  sortOrder?: number;
}

export interface WorkerPayload {
  vidros: InputGlass[];
  rollW: number;
  margin: number;
  modoOtimizacao: OptimizationMode;
  agressividadeCorte?: number;
}

export interface PackItem {
  id: string;
  ow: number;
  oh: number;
  cor: string;
  label?: string;
  forceRotate?: boolean;
  alignRight: boolean;
  sortOrder: number;
}

export interface PackedBlock {
  id: string;
  w: number;
  h: number;
  rw: number;
  rh: number;
  cor: string;
  label?: string;
  fit?: { x: number; y: number };
  rotated: boolean;
  h_visual: number;
  forceRotate?: boolean;
  alignRight: boolean;
  sortOrder: number;
}

export interface FreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ProColumn {
  x: number;
  width: number;
  currentHeight: number;
  blocks: PackedBlock[];
}

export interface ProShelf {
  y: number;
  height: number;
  width: number;
  columns: ProColumn[];
}

export interface ProStrategyConfig {
  name: string;
  mode: 'greedy' | 'composer';
  sortFn?: (a: PackItem, b: PackItem) => number;
  preferUpright?: boolean;
  preferWidthFit?: boolean;
}

export const STRIP_HEIGHT = 1_000_000;
export const EPS = 0.001;

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const cloneBlocks = (items: PackedBlock[]) => items.map((item) => ({ ...item, fit: item.fit ? { ...item.fit } : undefined }));

export const normalizeItems = (vidros: InputGlass[]): PackItem[] =>
  vidros
    .map((v) => ({
      id: v.id,
      ow: v.ow,
      oh: v.oh,
      cor: v.cor,
      label: v.label,
      forceRotate: v.forceRotate,
      alignRight: v.alignRight === true,
      sortOrder: v.sortOrder ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

export const toRawBlock = (item: PackItem, rotated: boolean): PackedBlock => {
  const rw = rotated ? item.oh : item.ow;
  const rh = rotated ? item.ow : item.oh;

  return {
    id: item.id,
    w: rw,
    h: rh,
    rw,
    rh,
    cor: item.cor,
    label: item.label,
    rotated,
    h_visual: rh,
    forceRotate: item.forceRotate,
    alignRight: item.alignRight,
    sortOrder: item.sortOrder,
  };
};

export const getProOrientations = (item: PackItem, rollW: number): PackedBlock[] => {
  const normal = toRawBlock(item, false);
  const rotated = toRawBlock(item, true);

  // Usuário forçou girado (90°)
  if (item.forceRotate === true) {
    return rotated.w <= rollW + EPS ? [rotated] : (normal.w <= rollW + EPS ? [normal] : []);
  }

  // Usuário forçou em pé (normal / 0°)
  if (item.forceRotate === false) {
    return normal.w <= rollW + EPS ? [normal] : (rotated.w <= rollW + EPS ? [rotated] : []);
  }

  // Modo automático (undefined): avalia as opções que cabem na largura da bobina
  const list: PackedBlock[] = [];
  if (normal.w <= rollW + EPS) list.push(normal);
  if (Math.abs(normal.w - rotated.w) > EPS || Math.abs(normal.h - rotated.h) > EPS) {
    if (rotated.w <= rollW + EPS) list.push(rotated);
  }
  return list;
};

export const alignProShelves = (shelves: ProShelf[], rollW: number) => {
  shelves.forEach((shelf) => {
    const remainingWidth = rollW - shelf.width;
    if (remainingWidth <= EPS) return;

    let currentRight = rollW;
    for (let i = shelf.columns.length - 1; i >= 0; i--) {
      const column = shelf.columns[i];
      if (!column.blocks.some((b) => b.alignRight === true)) break;

      const nextX = currentRight - column.width;
      const shift = nextX - column.x;
      column.x = nextX;
      column.blocks.forEach((b) => {
        if (b.fit) b.fit.x += shift;
      });
      currentRight = nextX - 3;
    }
  });
};

/**
 * Heurística de Corte Guilhotina (2-Stage Guillotine Puro)
 * Regra de Ouro: Proíbe estritamente cortes em "L" (stacking apenas quando larguras são idênticas).
 */
export const packShelfStrategyGuillotine = (
  items: PackItem[],
  rollW: number,
  margin: number,
  strategyConfig: ProStrategyConfig,
  agressividade: number
) => {
  const { sortFn, preferUpright = false, preferWidthFit = false, mode = 'greedy' } = strategyConfig;
  // Filtra itens que fisicamente não cabem na bobina em nenhuma orientação permitida
  let pool = items.filter((item) => getProOrientations(item, rollW).length > 0);
  if (sortFn) {
    pool.sort(sortFn);
  }

  const shelves: ProShelf[] = [];
  let currentY = 0;
  const minStackH = agressividade <= 20 ? 25 : 15;

  while (pool.length > 0) {
    const prevPoolLen = pool.length;
    let shelfHeight = 0;
    let shelfWidth = 0;
    let shelfColumns: ProColumn[] = [];
    let planApplied = false;

    if (mode === 'composer' && pool.length > 1) {
      const candidateLimit = Math.min(pool.length, 5);
      let bestPlan: { height: number; width: number; columns: ProColumn[]; remainingPool: PackItem[] } | null = null;
      let bestMetric = -Infinity;

      interface ShelfCandidate {
        cIdx: number;
        orient: PackedBlock;
        testH: number;
      }

      const candidateList: ShelfCandidate[] = [];
      const seenCandidates = new Set<string>();

      for (let c = 0; c < candidateLimit; c++) {
        const candItem = pool[c];
        for (const orient of getProOrientations(candItem, rollW)) {
          const keySingle = `${c}_${orient.w}_${orient.h}_${orient.h}`;
          if (!seenCandidates.has(keySingle)) {
            seenCandidates.add(keySingle);
            candidateList.push({ cIdx: c, orient, testH: orient.h });
          }

          // Combina altura apenas se duas peças tiverem rigorosamente a mesma largura (+-1cm)
          for (let c2 = c + 1; c2 < Math.min(pool.length, c + 6); c2++) {
            for (const o2 of getProOrientations(pool[c2], rollW)) {
              if (Math.abs(orient.w - o2.w) <= 1) {
                const comboH = orient.h + margin + o2.h;
                if (comboH <= rollW * 1.5) {
                  const keyCombo = `${c}_${orient.w}_${orient.h}_${comboH}`;
                  if (!seenCandidates.has(keyCombo)) {
                    seenCandidates.add(keyCombo);
                    candidateList.push({ cIdx: c, orient, testH: comboH });
                  }
                }
              }
            }
          }
        }
      }

      for (const { cIdx, orient, testH } of candidateList) {
        const testPool = [...pool];
        testPool.splice(cIdx, 1);
        const cols: ProColumn[] = [];
        let wTotal = 0;

        const addCol = (block: PackedBlock) => {
          const colX = wTotal > 0 ? wTotal + margin : 0;
          const col: ProColumn = {
            x: colX,
            width: block.w,
            blocks: [{ ...block, fit: { x: colX, y: currentY } }],
            currentHeight: block.h,
          };
          let remH = testH - col.currentHeight - margin;
          while (remH >= minStackH) {
            let bIdx = -1;
            let bBlock: PackedBlock | null = null;
            let bDiff = Infinity;
            for (let i = 0; i < testPool.length; i++) {
              for (const o of getProOrientations(testPool[i], rollW)) {
                // REGRA DE OURO: Somente empilha se tiver a mesma largura da coluna!
                if (Math.abs(o.w - col.width) <= 1 && o.h <= remH + EPS) {
                  const diff = remH - o.h;
                  if (diff < bDiff) {
                    bDiff = diff;
                    bIdx = i;
                    bBlock = o;
                  }
                }
              }
            }
            if (bIdx >= 0 && bBlock) {
              testPool.splice(bIdx, 1);
              col.blocks.push({ ...bBlock, fit: { x: col.x, y: currentY + col.currentHeight + margin } });
              col.currentHeight += margin + bBlock.h;
              remH = testH - col.currentHeight - margin;
            } else {
              break;
            }
          }
          cols.push(col);
          wTotal = col.x + col.width;
        };

        addCol(orient);

        while (true) {
          const remW = rollW - wTotal - margin;
          if (remW < 15) break;
          let bIdx = -1;
          let bBlock: PackedBlock | null = null;
          let bSc = Infinity;
          for (let i = 0; i < testPool.length; i++) {
            for (const o of getProOrientations(testPool[i], rollW)) {
              if (o.w <= remW + EPS && o.h <= testH + EPS) {
                // Opção A: agrupa alturas similares na mesma faixa
                const heightDiff = testH - o.h;
                const sc = heightDiff * 1.8 + (preferWidthFit ? (remW - o.w) * 0.8 : 0) + (o.rotated ? 4 : 0);
                if (sc < bSc) {
                  bSc = sc;
                  bIdx = i;
                  bBlock = o;
                }
              }
            }
          }
          if (bIdx >= 0 && bBlock) {
            testPool.splice(bIdx, 1);
            addCol(bBlock);
          } else {
            break;
          }
        }

        const placedArea = cols.reduce((s, col) => s + col.blocks.reduce((cs, b) => cs + b.w * b.h, 0), 0);
        const metric = (placedArea / (testH * rollW)) * 1000 + cols.length * 30;
        if (metric > bestMetric || !bestPlan) {
          bestMetric = metric;
          bestPlan = { height: testH, width: wTotal, columns: cols, remainingPool: testPool };
        }
      }

      if (bestPlan && bestPlan.columns.length > 0 && bestPlan.remainingPool.length < pool.length) {
        shelfHeight = bestPlan.height;
        shelfWidth = bestPlan.width;
        shelfColumns = bestPlan.columns;
        pool = bestPlan.remainingPool;
        planApplied = true;
      }
    }

    if (!planApplied) {
      // Greedy anchor mode (também serve de fallback se o composer não reduziu o pool)
      const firstItem = pool[0];
      const orients = getProOrientations(firstItem, rollW);
      if (orients.length === 0) {
        pool.shift();
        continue;
      }

      let anchor = orients[0];
      if (orients.length > 1) {
        if (preferUpright) {
          anchor = orients.find((o) => o.rh >= o.rw) || orients[0];
        } else {
          anchor = orients.sort((a, b) => b.h - a.h)[0];
        }
      }

      shelfHeight = anchor.h;
      pool.shift();

      const addCol = (block: PackedBlock) => {
        const colX = shelfWidth > 0 ? shelfWidth + margin : 0;
        const col: ProColumn = {
          x: colX,
          width: block.w,
          blocks: [{ ...block, fit: { x: colX, y: currentY } }],
          currentHeight: block.h,
        };
        let remH = shelfHeight - col.currentHeight - margin;
        while (remH >= minStackH) {
          let bIdx = -1;
          let bBlock: PackedBlock | null = null;
          let bDiff = Infinity;
          for (let i = 0; i < pool.length; i++) {
            for (const o of getProOrientations(pool[i], rollW)) {
              if (Math.abs(o.w - col.width) <= 1 && o.h <= remH + EPS) {
                const diff = remH - o.h;
                if (diff < bDiff) {
                  bDiff = diff;
                  bIdx = i;
                  bBlock = o;
                }
              }
            }
          }
          if (bIdx >= 0 && bBlock) {
            pool.splice(bIdx, 1);
            col.blocks.push({ ...bBlock, fit: { x: col.x, y: currentY + col.currentHeight + margin } });
            col.currentHeight += margin + bBlock.h;
            remH = shelfHeight - col.currentHeight - margin;
          } else {
            break;
          }
        }
        shelfColumns.push(col);
        shelfWidth = col.x + col.width;
      };

      addCol(anchor);

      while (true) {
        const remW = rollW - shelfWidth - margin;
        if (remW < 15) break;
        let bIdx = -1;
        let bBlock: PackedBlock | null = null;
        let bScore = Infinity;
        for (let i = 0; i < pool.length; i++) {
          for (const o of getProOrientations(pool[i], rollW)) {
            if (o.w <= remW + EPS && o.h <= shelfHeight + EPS) {
              const heightDiff = shelfHeight - o.h;
              const widthWaste = remW - o.w;
              const score = heightDiff * 1.8 + (preferWidthFit ? widthWaste * 0.8 : 0) + (o.rotated ? 4 : 0);
              if (score < bScore) {
                bScore = score;
                bIdx = i;
                bBlock = o;
              }
            }
          }
        }
        if (bIdx >= 0 && bBlock) {
          pool.splice(bIdx, 1);
          addCol(bBlock);
        } else {
          break;
        }
      }
    }

    if (shelfColumns.length > 0) {
      shelves.push({
        y: currentY,
        height: shelfHeight,
        width: shelfWidth,
        columns: shelfColumns,
      });

      currentY += shelfHeight + margin;
    }

    // Salvaguarda matemática absoluta: se o pool não diminuiu nesta volta, retira 1 item
    if (pool.length >= prevPoolLen) {
      pool.shift();
    }
  }

  alignProShelves(shelves, rollW);

  const allBlocks: PackedBlock[] = [];
  let totalAreaV = 0;
  let totalUsedArea = 0;
  let maxY = 0;

  for (const shelf of shelves) {
    for (const col of shelf.columns) {
      for (const block of col.blocks) {
        allBlocks.push(block);
        totalAreaV += block.rw * block.rh;
        totalUsedArea += block.w * block.h;
        maxY = Math.max(maxY, (block.fit?.y ?? 0) + block.h);
      }
    }
  }

  const lines = allBlocks
    .flatMap((block) => [block.fit?.y ?? 0, (block.fit?.y ?? 0) + block.h])
    .sort((a, b) => a - b);
  const groups: number[][] = [];
  lines.forEach((line) => {
    const last = groups[groups.length - 1];
    if (last && Math.abs(last[last.length - 1] - line) <= 1.5) {
      last.push(line);
    } else {
      groups.push([line]);
    }
  });
  const lineCount = groups.length;

  const rollArea = maxY * rollW;
  const waste = rollArea - totalUsedArea;
  const compactnessFactor = clamp(agressividade, 0, 100) / 100;
  const score = maxY * 1000 + waste * (1 + (1 - compactnessFactor) * 0.5) + lineCount * (1 - compactnessFactor) * 35;

  return {
    shelves,
    blocks: allBlocks,
    totalY: maxY,
    areaV: totalAreaV,
    usedArea: totalUsedArea,
    lineCount,
    score,
  };
};

export const PRO_STRATEGIES: ProStrategyConfig[] = [
  {
    name: 'greedy_tallest',
    mode: 'greedy',
    sortFn: (a, b) => Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh) || (b.ow * b.oh) - (a.ow * a.oh),
    preferUpright: true,
  },
  {
    name: 'greedy_height',
    mode: 'greedy',
    sortFn: (a, b) => b.oh - a.oh || b.ow - a.ow,
    preferUpright: true,
  },
  {
    name: 'greedy_area',
    mode: 'greedy',
    sortFn: (a, b) => (b.ow * b.oh) - (a.ow * a.oh) || Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh),
    preferUpright: false,
  },
  {
    name: 'greedy_clustered_15',
    mode: 'greedy',
    sortFn: (a, b) => Math.round(b.oh / 15) - Math.round(a.oh / 15) || b.ow - a.ow,
    preferUpright: true,
  },
  {
    name: 'greedy_clustered_25',
    mode: 'greedy',
    sortFn: (a, b) => Math.round(b.oh / 25) - Math.round(a.oh / 25) || (b.ow * b.oh) - (a.ow * a.oh),
    preferUpright: false,
  },
  {
    name: 'greedy_width',
    mode: 'greedy',
    sortFn: (a, b) => b.ow - a.ow || b.oh - a.oh,
    preferUpright: false,
  },
  {
    name: 'greedy_order',
    mode: 'greedy',
    sortFn: (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    preferUpright: true,
  },
  {
    name: 'greedy_narrow_upright',
    mode: 'greedy',
    sortFn: (a, b) => (a.ow - b.ow) || (b.oh - a.oh),
    preferUpright: true,
  },
  {
    name: 'greedy_width_fit',
    mode: 'greedy',
    sortFn: (a, b) => Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh) || (b.ow * b.oh) - (a.ow * a.oh),
    preferWidthFit: true,
    preferUpright: true,
  },
  {
    name: 'composer_area',
    mode: 'composer',
    sortFn: (a, b) => (b.ow * b.oh) - (a.ow * a.oh) || Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh),
    preferUpright: false,
  },
  {
    name: 'composer_height',
    mode: 'composer',
    sortFn: (a, b) => b.oh - a.oh || b.ow - a.ow,
    preferUpright: true,
  },
  {
    name: 'composer_clustered',
    mode: 'composer',
    sortFn: (a, b) => Math.round(b.oh / 20) - Math.round(a.oh / 20) || (b.ow * b.oh) - (a.ow * a.oh),
    preferUpright: false,
  },
  {
    name: 'composer_narrow_upright',
    mode: 'composer',
    sortFn: (a, b) => (a.ow - b.ow) || (b.oh - a.oh),
    preferUpright: true,
  },
  {
    name: 'composer_width_fit',
    mode: 'composer',
    sortFn: (a, b) => b.oh - a.oh || b.ow - a.ow,
    preferWidthFit: true,
    preferUpright: false,
  },
];

/**
 * Algoritmo Unificado de Corte Prático (Guilhotina 2-Stage)
 */
export const packGuillotine = (
  items: PackItem[],
  rollW: number,
  margin: number,
  agressividadeCorte: number = 35
) => {
  if (items.length === 0) return { blocks: [], totalY: 0, areaV: 0, shelves: [] };

  let bestResult: ReturnType<typeof packShelfStrategyGuillotine> | null = null;

  for (const strat of PRO_STRATEGIES) {
    const res = packShelfStrategyGuillotine(items, rollW, margin, strat, agressividadeCorte);
    if (
      !bestResult ||
      res.totalY < bestResult.totalY ||
      (Math.abs(res.totalY - bestResult.totalY) < EPS && res.score < bestResult.score)
    ) {
      bestResult = res;
    }
  }

  if (!bestResult) return { blocks: [], totalY: 0, areaV: 0, shelves: [] };

  const blocks = cloneBlocks(bestResult.blocks).sort(
    (a, b) => (a.fit?.y ?? 0) - (b.fit?.y ?? 0) || (a.fit?.x ?? 0) - (b.fit?.x ?? 0)
  );

  return {
    blocks,
    totalY: bestResult.totalY,
    areaV: bestResult.areaV,
    shelves: bestResult.shelves,
  };
};

/**
 * Algoritmo de Densidade Máxima (2D Bin-Packing livre para menor metragem possível)
 */
const intersects = (a: FreeRect, b: FreeRect) =>
  a.x < b.x + b.w - EPS &&
  a.x + a.w > b.x + EPS &&
  a.y < b.y + b.h - EPS &&
  a.y + a.h > b.y + EPS;

const isContained = (a: FreeRect, b: FreeRect) =>
  a.x >= b.x - EPS &&
  a.y >= b.y - EPS &&
  a.x + a.w <= b.x + b.w + EPS &&
  a.y + a.h <= b.y + b.h + EPS;

const pruneFreeRects = (rects: FreeRect[]) => {
  const valid = rects.filter((rect) => rect.w > EPS && rect.h > EPS);
  const pruned: FreeRect[] = [];

  for (let i = 0; i < valid.length; i++) {
    let contained = false;
    for (let j = 0; j < valid.length; j++) {
      if (i !== j && isContained(valid[i], valid[j])) {
        contained = true;
        break;
      }
    }
    if (!contained) pruned.push(valid[i]);
  }

  return pruned
    .sort((a, b) => a.y - b.y || a.x - b.x || (a.w * a.h) - (b.w * b.h))
    .slice(0, 90);
};

const splitFreeRects = (freeRects: FreeRect[], placed: FreeRect) => {
  const nextRects: FreeRect[] = [];

  freeRects.forEach((rect) => {
    if (!intersects(rect, placed)) {
      nextRects.push(rect);
      return;
    }

    if (placed.y > rect.y) {
      nextRects.push({ x: rect.x, y: rect.y, w: rect.w, h: placed.y - rect.y });
    }
    if (placed.y + placed.h < rect.y + rect.h) {
      nextRects.push({
        x: rect.x,
        y: placed.y + placed.h,
        w: rect.w,
        h: rect.y + rect.h - (placed.y + placed.h),
      });
    }
    if (placed.x > rect.x) {
      nextRects.push({ x: rect.x, y: rect.y, w: placed.x - rect.x, h: rect.h });
    }
    if (placed.x + placed.w < rect.x + rect.w) {
      nextRects.push({
        x: placed.x + placed.w,
        y: rect.y,
        w: rect.x + rect.w - (placed.x + placed.w),
        h: rect.h,
      });
    }
  });

  return pruneFreeRects(nextRects);
};

export const packDensity = (items: PackItem[], rollW: number, margin: number) => {
  const blocks = items
    .map((item) => toRawBlock(item, item.forceRotate === true))
    .sort((a, b) => (b.w * b.h) - (a.w * a.h));
  let freeRects: FreeRect[] = [{ x: 0, y: 0, w: rollW, h: STRIP_HEIGHT }];
  let currentMaxY = 0;
  let currentAreaV = 0;

  blocks.forEach((block) => {
    let best: { rect: FreeRect; footprint: FreeRect; x: number; rotated: boolean; score: number } | null = null;
    const item: PackItem = {
      id: block.id,
      ow: block.rotated ? block.rh : block.rw,
      oh: block.rotated ? block.rw : block.rh,
      cor: block.cor,
      label: block.label,
      forceRotate: block.forceRotate,
      alignRight: block.alignRight,
      sortOrder: block.sortOrder,
    };

    const orientations = getProOrientations(item, rollW);

    orientations.forEach((candidate) => {
      freeRects.forEach((rect) => {
        if (candidate.w <= rect.w + EPS && candidate.h <= rect.h + EPS) {
          const x = block.alignRight ? rect.x + (rect.w - candidate.w) : rect.x;
          const footprint: FreeRect = {
            x,
            y: rect.y,
            w: candidate.w + (x + candidate.w + margin <= rollW + EPS ? margin : 0),
            h: candidate.h + margin,
          };
          const nextMaxY = Math.max(currentMaxY, footprint.y + candidate.h);
          const score = nextMaxY * 1000 + footprint.y * 10 + footprint.x;

          if (!best || score < best.score) {
            best = { rect, footprint, x, rotated: candidate.rotated, score };
          }
        }
      });
    });

    if (best) {
      const selected = toRawBlock(item, (best as any).rotated);
      selected.fit = { x: (best as any).x, y: (best as any).rect.y };
      currentMaxY = Math.max(currentMaxY, selected.fit.y + selected.h);
      currentAreaV += selected.rw * selected.rh;
      freeRects = splitFreeRects(freeRects, (best as any).footprint);
      Object.assign(block, selected);
    }
  });

  return {
    blocks: blocks.filter((b) => b.fit),
    totalY: currentMaxY,
    areaV: currentAreaV,
  };
};

