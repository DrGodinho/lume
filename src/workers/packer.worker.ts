type OptimizationMode = 'densidade' | 'facilidade' | 'facilidade_v2';

interface InputGlass {
  id: string;
  ow: number;
  oh: number;
  cor: string;
  label?: string;
  forceRotate?: boolean;
  alignRight?: boolean;
  sortOrder?: number;
}

interface WorkerPayload {
  vidros: InputGlass[];
  rollW: number;
  margin: number;
  modoOtimizacao: OptimizationMode;
  agressividadeCorte?: number;
}

interface PackItem {
  id: string;
  ow: number;
  oh: number;
  cor: string;
  label?: string;
  forceRotate?: boolean;
  alignRight: boolean;
  sortOrder: number;
}

interface PackedBlock {
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

interface FreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ProColumn {
  x: number;
  width: number;
  currentHeight: number;
  blocks: PackedBlock[];
}

interface ProShelf {
  y: number;
  height: number;
  width: number;
  columns: ProColumn[];
}

interface ProStrategyConfig {
  name: string;
  mode: 'greedy' | 'composer';
  sortFn?: (a: PackItem, b: PackItem) => number;
  preferUpright?: boolean;
  preferWidthFit?: boolean;
}

const STRIP_HEIGHT = 1_000_000;
const EPS = 0.001;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const cloneBlocks = (items: PackedBlock[]) => items.map((item) => ({ ...item, fit: item.fit ? { ...item.fit } : undefined }));

const normalizeItems = (vidros: InputGlass[]): PackItem[] =>
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

const toRawBlock = (item: PackItem, rotated: boolean): PackedBlock => {
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

const getRawOrientations = (item: PackItem): PackedBlock[] => {
  const forced = item.forceRotate === true;
  const normal = toRawBlock(item, false);
  const rotated = toRawBlock(item, true);

  if (forced) return [rotated];
  if (Math.abs(normal.w - rotated.w) < EPS && Math.abs(normal.h - rotated.h) < EPS) return [normal];
  return [normal, rotated];
};

const getPlacementFootprint = (block: PackedBlock, x: number, y: number, rollW: number, margin: number): FreeRect => {
  const hasUsableRightMargin = x + block.w + margin <= rollW + EPS;

  return {
    x,
    y,
    w: block.w + (hasUsableRightMargin ? margin : 0),
    h: block.h + margin,
  };
};

const fitsInside = (outer: FreeRect, inner: FreeRect) =>
  inner.x >= outer.x - EPS &&
  inner.y >= outer.y - EPS &&
  inner.x + inner.w <= outer.x + outer.w + EPS &&
  inner.y + inner.h <= outer.y + outer.h + EPS;

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

const getProOrientations = (item: PackItem, rollW: number): PackedBlock[] => {
  const forced = item.forceRotate === true;
  const normal = toRawBlock(item, false);
  const rotated = toRawBlock(item, true);

  if (forced) {
    return rotated.w <= rollW + EPS ? [rotated] : [];
  }

  const list: PackedBlock[] = [];
  if (normal.w <= rollW + EPS) list.push(normal);
  if (Math.abs(normal.w - rotated.w) > EPS || Math.abs(normal.h - rotated.h) > EPS) {
    if (rotated.w <= rollW + EPS) list.push(rotated);
  }
  return list;
};

const alignProShelves = (shelves: ProShelf[], rollW: number) => {
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

const packShelfStrategy = (
  items: PackItem[],
  rollW: number,
  margin: number,
  strategyConfig: ProStrategyConfig,
  agressividade: number
) => {
  const { sortFn, preferUpright = false, preferWidthFit = false, mode = 'greedy' } = strategyConfig;
  let pool = [...items];
  if (sortFn) {
    pool.sort(sortFn);
  }

  const shelves: ProShelf[] = [];
  let currentY = 0;
  const minStackH = agressividade <= 20 ? 30 : 18;

  while (pool.length > 0) {
    let shelfHeight = 0;
    let shelfWidth = 0;
    let shelfColumns: ProColumn[] = [];

    if (mode === 'composer' && pool.length > 1) {
      const candidateLimit = Math.min(pool.length, 5);
      let bestPlan: { height: number; width: number; columns: ProColumn[]; remainingPool: PackItem[] } | null = null;
      let bestMetric = -Infinity;

      // Build candidate heights to test:
      // 1. Single orientations of initial items
      // 2. Composite stacked heights where two items share the same width
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

          // Check if stacking with another item of identical or near-identical width can form a composite shelf height
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
            let bW = Infinity;
            for (let i = 0; i < testPool.length; i++) {
              for (const o of getProOrientations(testPool[i], rollW)) {
                if (o.w <= col.width + EPS && o.h <= remH + EPS) {
                  const diff = (col.width - o.w) * 1.5 + (remH - o.h);
                  if (diff < bW) {
                    bW = diff;
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
                const sc = (testH - o.h) * 2 + (preferWidthFit ? (remW - o.w) * 0.8 : 0) + (o.rotated ? 4 : 0);
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

      if (bestPlan) {
        shelfHeight = bestPlan.height;
        shelfWidth = bestPlan.width;
        shelfColumns = bestPlan.columns;
        pool = bestPlan.remainingPool;
      }
    } else {
      // Greedy anchor mode
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
          let bW = Infinity;
          for (let i = 0; i < pool.length; i++) {
            for (const o of getProOrientations(pool[i], rollW)) {
              if (o.w <= col.width + EPS && o.h <= remH + EPS) {
                const diff = (col.width - o.w) * 1.5 + (remH - o.h);
                if (diff < bW) {
                  bW = diff;
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
              const score = heightDiff * 2 + (preferWidthFit ? widthWaste * 0.8 : 0) + (o.rotated ? 4 : 0);
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

    shelves.push({
      y: currentY,
      height: shelfHeight,
      width: shelfWidth,
      columns: shelfColumns,
    });

    currentY += shelfHeight + margin;
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

const packEasyPro = (
  items: PackItem[],
  rollW: number,
  margin: number,
  agressividadeCorte: number = 35
) => {
  if (items.length === 0) return { blocks: [], totalY: 0, areaV: 0 };

  const strategies: ProStrategyConfig[] = [
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

  let bestResult: ReturnType<typeof packShelfStrategy> | null = null;

  for (const strat of strategies) {
    const res = packShelfStrategy(items, rollW, margin, strat, agressividadeCorte);
    if (
      !bestResult ||
      res.totalY < bestResult.totalY ||
      (Math.abs(res.totalY - bestResult.totalY) < EPS && res.score < bestResult.score)
    ) {
      bestResult = res;
    }
  }

  if (!bestResult) return { blocks: [], totalY: 0, areaV: 0 };

  const blocks = cloneBlocks(bestResult.blocks).sort(
    (a, b) => (a.fit?.y ?? 0) - (b.fit?.y ?? 0) || (a.fit?.x ?? 0) - (b.fit?.x ?? 0)
  );

  return {
    blocks,
    totalY: bestResult.totalY,
    areaV: bestResult.areaV,
  };
};

const packEasyV2 = (
  items: PackItem[],
  rollW: number,
  margin: number,
  agressividadeCorte: number = 35
) => {
  return packEasyPro(items, rollW, margin, agressividadeCorte);
};

const packDensity = (items: PackItem[], rollW: number, margin: number) => {
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

    for (const orientation of getRawOrientations(item)) {
      for (const rect of freeRects) {
        if (orientation.w > rect.w + EPS || orientation.h > rect.h + EPS) continue;
        const xCandidates = new Set<number>([
          orientation.alignRight ? Math.min(rect.x + rect.w - orientation.w, rollW - orientation.w) : rect.x,
          rollW - orientation.w,
          rect.x + rect.w - orientation.w - margin,
        ]);

        for (const xValue of xCandidates) {
          const x = clamp(xValue, rect.x, rect.x + rect.w - orientation.w);
          const footprint = getPlacementFootprint(orientation, x, rect.y, rollW, margin);
          if (!fitsInside(rect, footprint)) continue;

          const score = rect.y * 10_000 + x + (orientation.rotated ? 5 : 0);
          if (!best || score < best.score) best = { rect, footprint, x, rotated: orientation.rotated, score };
        }
      }
    }

    if (!best) return;

    const placedBlock = toRawBlock(item, best.rotated);
    placedBlock.fit = { x: best.x, y: best.rect.y };
    Object.assign(block, placedBlock);

    freeRects = splitFreeRects(freeRects, best.footprint);
    currentMaxY = Math.max(currentMaxY, best.rect.y + block.h);
    currentAreaV += block.rw * block.rh;
  });

  return { blocks, totalY: currentMaxY, areaV: currentAreaV };
};

interface ShelfColumn {
  x: number;
  width: number;
  currentHeight: number;
  blocks: PackedBlock[];
}

interface Shelf {
  y: number;
  height: number;
  currentWidth: number;
  columns: ShelfColumn[];
}

interface EasyShelfState {
  shelves: Shelf[];
  totalY: number;
  currentAreaV: number;
  usedArea: number;
  rotations: number;
  uprightCount: number;
}

type EasyPlacementType = 'existingColumn' | 'newColumn' | 'newShelf';

interface EasyPlacementCandidate {
  type: EasyPlacementType;
  block: PackedBlock;
  score: number;
  shelfIndex?: number;
  columnIndex?: number;
}

const EASY_V1_VERTICAL_SNAP = 10;
const EASY_V1_MIN_USEFUL_WIDTH = 35;

const isUprightBlock = (block: PackedBlock) => block.rh + EPS >= block.rw;

const cloneShelves = (shelves: Shelf[]) =>
  shelves.map((shelf) => ({
    y: shelf.y,
    height: shelf.height,
    currentWidth: shelf.currentWidth,
    columns: shelf.columns.map((column) => ({
      x: column.x,
      width: column.width,
      currentHeight: column.currentHeight,
      blocks: cloneBlocks(column.blocks),
    })),
  }));

const cloneEasyState = (state: EasyShelfState): EasyShelfState => ({
  shelves: cloneShelves(state.shelves),
  totalY: state.totalY,
  currentAreaV: state.currentAreaV,
  usedArea: state.usedArea,
  rotations: state.rotations,
  uprightCount: state.uprightCount,
});

const getSnappedVisualHeight = (block: PackedBlock, availableHeight: number) => {
  const gap = availableHeight - block.h;
  return gap >= -EPS && gap <= EASY_V1_VERTICAL_SNAP ? availableHeight : block.h;
};

const getSideRoomPenalty = (remainingWidth: number, shelfHeight: number) => {
  if (remainingWidth <= EPS) return -450;
  if (remainingWidth < EASY_V1_MIN_USEFUL_WIDTH) return remainingWidth * shelfHeight * 0.5 + 900;
  return -Math.min(remainingWidth * shelfHeight * 0.18, 2_400);
};

const getEasyV1OrientationScore = (block: PackedBlock, rollW: number) => {
  const overflow = Math.max(0, block.w - rollW);
  const remainingWidth = Math.max(0, rollW - block.w);
  const uprightScore = isUprightBlock(block) ? -2_800 : 2_800;
  const sideRoomScore = remainingWidth >= EASY_V1_MIN_USEFUL_WIDTH
    ? -Math.min(remainingWidth * 18, 2_200)
    : 900;

  return (
    overflow * 40_000 +
    uprightScore +
    sideRoomScore +
    block.w * 7 -
    Math.min(block.h, 240) * 8 +
    (block.rotated ? 2 : 0)
  );
};

const getEasyV1Orientations = (item: PackItem, rollW: number) =>
  getRawOrientations(item)
    .sort((a, b) => getEasyV1OrientationScore(a, rollW) - getEasyV1OrientationScore(b, rollW));

const getPreferredEasyV1Block = (item: PackItem, rollW: number) =>
  getEasyV1Orientations(item, rollW)[0] ?? toRawBlock(item, item.forceRotate === true);

const getEasyV1OrderStrategies = (items: PackItem[], rollW: number) => {
  const byOrder = [...items];
  const byPreferredHeight = [...items].sort((a, b) => {
    const blockA = getPreferredEasyV1Block(a, rollW);
    const blockB = getPreferredEasyV1Block(b, rollW);
    return blockB.h - blockA.h || blockB.w - blockA.w || (b.ow * b.oh) - (a.ow * a.oh);
  });
  const byArea = [...items].sort((a, b) => (b.ow * b.oh) - (a.ow * a.oh));
  const byNarrowUpright = [...items].sort((a, b) => {
    const blockA = getPreferredEasyV1Block(a, rollW);
    const blockB = getPreferredEasyV1Block(b, rollW);
    return blockA.w - blockB.w || blockB.h - blockA.h;
  });
  const strategies = [byPreferredHeight, byArea, byNarrowUpright, byOrder];

  if (items.length <= 45) {
    strategies.push(
      [...items].sort((a, b) => Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh)),
      [...items].sort((a, b) => Math.min(a.ow, a.oh) - Math.min(b.ow, b.oh))
    );
  }

  const seen = new Set<string>();
  return strategies.filter((strategy) => {
    const key = strategy.map((item) => item.id).join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getEasyV1PlacementScore = (
  type: EasyPlacementType,
  state: EasyShelfState,
  block: PackedBlock,
  shelf: Shelf | null,
  column: ShelfColumn | null,
  rollW: number,
  margin: number
) => {
  const orientationScore = getEasyV1OrientationScore(block, rollW);

  if (type === 'existingColumn' && shelf && column) {
    const topGap = column.blocks.length > 0 ? margin : 0;
    const remainingHeight = shelf.height - column.currentHeight - topGap;
    const visualHeight = getSnappedVisualHeight(block, remainingHeight);
    const heightGap = remainingHeight - visualHeight;
    const widthGap = column.width - block.w;

    return (
      shelf.y * 35 +
      heightGap * 120 +
      widthGap * 45 +
      orientationScore * 0.7 -
      (visualHeight > block.h ? 700 : 0)
    );
  }

  if (type === 'newColumn' && shelf) {
    const leftGap = shelf.columns.length > 0 ? margin : 0;
    const visualHeight = getSnappedVisualHeight(block, shelf.height);
    const remainingWidth = rollW - shelf.currentWidth - leftGap - block.w;
    const heightGap = shelf.height - visualHeight;

    return (
      shelf.y * 40 +
      heightGap * 100 +
      getSideRoomPenalty(remainingWidth, shelf.height) +
      orientationScore * 0.85 -
      (visualHeight > block.h ? 900 : 0)
    );
  }

  const topGap = state.shelves.length > 0 ? margin : 0;
  const remainingWidth = rollW - block.w;
  return (
    state.totalY * 40 +
    topGap * 2_000 +
    block.h * 35 +
    getSideRoomPenalty(remainingWidth, block.h) +
    orientationScore
  );
};

const buildEasyV1Candidates = (state: EasyShelfState, item: PackItem, rollW: number, margin: number, limit: number) => {
  const candidates: EasyPlacementCandidate[] = [];
  const orientations = getEasyV1Orientations(item, rollW);

  orientations.forEach((block) => {
    state.shelves.forEach((shelf, shelfIndex) => {
      shelf.columns.forEach((column, columnIndex) => {
        const topGap = column.blocks.length > 0 ? margin : 0;
        const remainingHeight = shelf.height - column.currentHeight - topGap;
        if (block.w <= column.width + EPS && block.h <= remainingHeight + EPS) {
          candidates.push({
            type: 'existingColumn',
            block,
            shelfIndex,
            columnIndex,
            score: getEasyV1PlacementScore('existingColumn', state, block, shelf, column, rollW, margin),
          });
        }
      });

      const leftGap = shelf.columns.length > 0 ? margin : 0;
      const remainingWidth = rollW - shelf.currentWidth - leftGap;
      if (block.w <= remainingWidth + EPS && block.h <= shelf.height + EPS) {
        candidates.push({
          type: 'newColumn',
          block,
          shelfIndex,
          score: getEasyV1PlacementScore('newColumn', state, block, shelf, null, rollW, margin),
        });
      }
    });

    candidates.push({
      type: 'newShelf',
      block,
      score: getEasyV1PlacementScore('newShelf', state, block, null, null, rollW, margin),
    });
  });

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
};

const applyEasyV1Candidate = (state: EasyShelfState, candidate: EasyPlacementCandidate, margin: number): EasyShelfState => {
  const next = cloneEasyState(state);
  const block: PackedBlock = { ...candidate.block, fit: undefined };

  if (candidate.type === 'existingColumn') {
    const shelf = next.shelves[candidate.shelfIndex ?? 0];
    const column = shelf.columns[candidate.columnIndex ?? 0];
    const topGap = column.blocks.length > 0 ? margin : 0;
    const availableHeight = shelf.height - column.currentHeight - topGap;
    block.fit = { x: column.x, y: shelf.y + column.currentHeight + topGap };
    block.h_visual = getSnappedVisualHeight(block, availableHeight);
    column.blocks.push(block);
    column.currentHeight += topGap + block.h_visual;
  } else if (candidate.type === 'newColumn') {
    const shelf = next.shelves[candidate.shelfIndex ?? 0];
    const leftGap = shelf.columns.length > 0 ? margin : 0;
    block.fit = { x: shelf.currentWidth + leftGap, y: shelf.y };
    block.h_visual = getSnappedVisualHeight(block, shelf.height);
    shelf.columns.push({
      x: shelf.currentWidth + leftGap,
      width: block.w,
      currentHeight: block.h_visual,
      blocks: [block],
    });
    shelf.currentWidth += leftGap + block.w;
  } else {
    const topGap = next.shelves.length > 0 ? margin : 0;
    const y = next.totalY + topGap;
    block.fit = { x: 0, y };
    block.h_visual = block.h;
    next.shelves.push({
      y,
      height: block.h,
      currentWidth: block.w,
      columns: [{
        x: 0,
        width: block.w,
        currentHeight: block.h,
        blocks: [block],
      }],
    });
    next.totalY = y + block.h;
  }

  next.currentAreaV += block.rw * block.rh;
  next.usedArea += block.w * block.h;
  next.rotations += block.rotated ? 1 : 0;
  next.uprightCount += isUprightBlock(block) ? 1 : 0;

  return next;
};

const getEasyV1StateScore = (state: EasyShelfState, rollW: number) => {
  let shelfWaste = 0;
  let verticalGaps = 0;
  let usefulSideRoom = 0;
  let narrowSideWaste = 0;
  let overflow = 0;

  state.shelves.forEach((shelf) => {
    const shelfWidth = Math.max(rollW, shelf.currentWidth);
    const shelfArea = shelfWidth * shelf.height;
    const visualArea = shelf.columns.reduce(
      (sum, column) => sum + column.blocks.reduce((blockSum, block) => blockSum + block.w * (block.h_visual || block.h), 0),
      0
    );
    const remainingWidth = rollW - shelf.currentWidth;

    shelfWaste += Math.max(0, shelfArea - visualArea);
    overflow += Math.max(0, shelf.currentWidth - rollW);
    verticalGaps += shelf.columns.reduce((sum, column) => sum + Math.max(0, shelf.height - column.currentHeight), 0);

    if (remainingWidth >= EASY_V1_MIN_USEFUL_WIDTH) {
      usefulSideRoom += remainingWidth * shelf.height;
    } else if (remainingWidth > EPS) {
      narrowSideWaste += remainingWidth * shelf.height;
    }
  });

  const blockCount = state.shelves.reduce((sum, shelf) => sum + shelf.columns.reduce((colSum, column) => colSum + column.blocks.length, 0), 0);
  const nonUprightBlocks = blockCount - state.uprightCount;

  return (
    state.totalY * 7_000 +
    shelfWaste * 2 +
    verticalGaps * 35 +
    narrowSideWaste * 12 +
    overflow * 40_000 +
    state.shelves.length * 900 +
    nonUprightBlocks * 1_200 -
    usefulSideRoom * 1.5 +
    state.rotations * 2
  );
};

const dedupeEasyV1States = (states: EasyShelfState[], rollW: number, limit: number) => {
  const seen = new Set<string>();
  const result: EasyShelfState[] = [];

  states
    .sort((a, b) => getEasyV1StateScore(a, rollW) - getEasyV1StateScore(b, rollW))
    .forEach((state) => {
      const key = state.shelves
        .map((shelf) => [
          Math.round(shelf.y),
          Math.round(shelf.height),
          Math.round(shelf.currentWidth),
          shelf.columns.map((column) => `${Math.round(column.width)}:${Math.round(column.currentHeight)}`).join(','),
        ].join(':'))
        .join('|');

      if (!seen.has(key) && result.length < limit) {
        seen.add(key);
        result.push(state);
      }
    });

  return result;
};

const alignEasyV1Shelves = (shelves: Shelf[], rollW: number) => {
  shelves.forEach((shelf) => {
    const remainingWidth = rollW - shelf.currentWidth;

    if (shelf.columns.length > 1 && remainingWidth > 5 && remainingWidth < 60) {
      const lastColumn = shelf.columns[shelf.columns.length - 1];
      const nextX = rollW - lastColumn.width;
      const shift = nextX - lastColumn.x;
      lastColumn.x = nextX;
      lastColumn.blocks.forEach((block) => {
        if (block.fit) block.fit.x += shift;
      });
      return;
    }

    if (remainingWidth <= 0) return;

    let currentRight = rollW;
    for (let index = shelf.columns.length - 1; index >= 0; index--) {
      const column = shelf.columns[index];
      if (!column.blocks.some((block) => block.alignRight === true)) break;

      const nextX = currentRight - column.width;
      const shift = nextX - column.x;
      column.x = nextX;
      column.blocks.forEach((block) => {
        if (block.fit) block.fit.x += shift;
      });
      currentRight = nextX;
    }
  });
};

const packEasyLegacy = (items: PackItem[], rollW: number, margin: number) => {
  if (items.length === 0) return { totalY: 0, currentAreaV: 0, blocks: [] };

  const beamWidth = items.length > 120 ? 8 : items.length > 80 ? 10 : items.length > 45 ? 14 : 18;
  const candidateLimit = items.length > 120 ? 7 : items.length > 80 ? 8 : items.length > 45 ? 10 : 12;
  let bestState: EasyShelfState | null = null;

  for (const orderedItems of getEasyV1OrderStrategies(items, rollW)) {
    let beam: EasyShelfState[] = [{
      shelves: [],
      totalY: 0,
      currentAreaV: 0,
      usedArea: 0,
      rotations: 0,
      uprightCount: 0,
    }];

    orderedItems.forEach((item) => {
      const nextStates: EasyShelfState[] = [];

      beam.forEach((state) => {
        buildEasyV1Candidates(state, item, rollW, margin, candidateLimit)
          .forEach((candidate) => {
            nextStates.push(applyEasyV1Candidate(state, candidate, margin));
          });
      });

      beam = dedupeEasyV1States(nextStates, rollW, beamWidth);
    });

    const candidateBest = beam.sort((a, b) => getEasyV1StateScore(a, rollW) - getEasyV1StateScore(b, rollW))[0];
    if (!bestState || getEasyV1StateScore(candidateBest, rollW) < getEasyV1StateScore(bestState, rollW)) {
      bestState = candidateBest;
    }
  }

  if (!bestState) return { totalY: 0, currentAreaV: 0, blocks: [] };

  const shelves = cloneShelves(bestState.shelves);
  alignEasyV1Shelves(shelves, rollW);

  const blocks = shelves
    .flatMap((shelf) => shelf.columns.flatMap((column) => column.blocks))
    .sort((a, b) => (a.fit?.y ?? 0) - (b.fit?.y ?? 0) || (a.fit?.x ?? 0) - (b.fit?.x ?? 0));

  return { totalY: bestState.totalY, currentAreaV: bestState.currentAreaV, blocks };
};

self.onmessage = (event: MessageEvent<WorkerPayload>) => {
  const { vidros, rollW, margin, modoOtimizacao, agressividadeCorte = 35 } = event.data;
  const items = normalizeItems(vidros);

  if (modoOtimizacao === 'densidade') {
    const packed = packDensity(items, rollW, margin);
    self.postMessage({ blocos: packed.blocks, maxY: packed.totalY, areaV: packed.areaV });
    return;
  }

  if (modoOtimizacao === 'facilidade_v2') {
    const packed = packEasyV2(items, rollW, margin, agressividadeCorte);
    self.postMessage({ blocos: packed.blocks, maxY: packed.totalY, areaV: packed.areaV });
    return;
  }

  const packed = packEasyLegacy(items, rollW, margin);
  self.postMessage({ blocos: packed.blocks, maxY: packed.totalY, areaV: packed.currentAreaV });
};
