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

interface BeamState {
  blocks: PackedBlock[];
  freeRects: FreeRect[];
  maxY: number;
  areaV: number;
  usedArea: number;
  rotations: number;
  horizontalLines: number[];
}

interface PlacementCandidate {
  block: PackedBlock;
  rect: FreeRect;
  score: number;
}

const STRIP_HEIGHT = 1_000_000;
const EPS = 0.001;

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

const toBlock = (item: PackItem, margin: number, rotated: boolean): PackedBlock => {
  const rw = rotated ? item.oh : item.ow;
  const rh = rotated ? item.ow : item.oh;
  const w = rw + margin;
  const h = rh + margin;

  return {
    id: item.id,
    w,
    h,
    rw,
    rh,
    cor: item.cor,
    label: item.label,
    rotated,
    h_visual: h,
    forceRotate: item.forceRotate,
    alignRight: item.alignRight,
    sortOrder: item.sortOrder,
  };
};

const getOrientations = (item: PackItem, margin: number): PackedBlock[] => {
  const forced = item.forceRotate === true;
  const normal = toBlock(item, margin, false);
  const rotated = toBlock(item, margin, true);

  if (forced) return [rotated];
  if (Math.abs(normal.w - rotated.w) < EPS && Math.abs(normal.h - rotated.h) < EPS) return [normal];
  return [normal, rotated];
};

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

const alignmentPenalty = (x: number, w: number, rollW: number, blocks: PackedBlock[]) => {
  const anchors = new Set<number>([0, rollW - w]);
  blocks.forEach((block) => {
    if (block.fit) {
      anchors.add(block.fit.x);
      anchors.add(block.fit.x + block.w - w);
    }
  });

  let best = Infinity;
  anchors.forEach((anchor) => {
    if (anchor >= -EPS && anchor + w <= rollW + EPS) {
      best = Math.min(best, Math.abs(anchor - x));
    }
  });

  return Number.isFinite(best) ? best : 0;
};

const uniqueRoundedCount = (values: number[]) => new Set(values.map((value) => Math.round(value))).size;

const getEaseBias = (agressividadeCorte: number) => {
  const normalized = Math.max(0, Math.min(100, agressividadeCorte)) / 100;
  return {
    wasteWeight: 8 + normalized * 12,
    fragmentationWeight: 80 - normalized * 45,
    xLineWeight: 55 - normalized * 41,
    yLineWeight: 22 - normalized * 17,
    raggedWeight: 44 - normalized * 35,
    alignmentWeight: 28 - normalized * 20,
    verticalGapWeight: 9 - normalized * 5,
    horizontalSnapTolerance: 6 + (1 - normalized) * 22,
    horizontalSnapWeight: 260 - normalized * 190,
    lineCreationWeight: 220 - normalized * 150,
    shelfStartBonus: -180 + normalized * 130,
    edgeBonus: -50 + normalized * 20,
  };
};

const stateScore = (state: BeamState, rollW: number, agressividadeCorte: number) => {
  const bias = getEaseBias(agressividadeCorte);
  const waste = Math.max(0, state.maxY * rollW - state.usedArea);
  const xs = state.blocks.map((block) => block.fit?.x ?? 0);
  const raggedBlocks = state.blocks.filter((block) => {
    const x = block.fit?.x ?? 0;
    return x > EPS && x + block.w < rollW - EPS;
  }).length;

  return (
    state.maxY * 6_000 +
    waste * bias.wasteWeight +
    state.freeRects.length * bias.fragmentationWeight +
    uniqueRoundedCount(xs) * bias.xLineWeight +
    uniqueRoundedCount(state.horizontalLines) * bias.yLineWeight +
    raggedBlocks * bias.raggedWeight +
    state.rotations * 3
  );
};

const nearestLineDistance = (line: number, lines: number[]) => {
  if (lines.length === 0) return Infinity;
  return Math.min(...lines.map((existing) => Math.abs(existing - line)));
};

const mergeHorizontalLines = (lines: number[], nextLine: number, tolerance: number) => {
  const closeLine = lines.find((line) => Math.abs(line - nextLine) <= tolerance);
  const merged = closeLine === undefined ? [...lines, nextLine] : lines;
  return [...new Set(merged.map((line) => Math.round(line * 1000) / 1000))].sort((a, b) => a - b);
};

const placementScore = (state: BeamState, block: PackedBlock, rect: FreeRect, x: number, rollW: number, agressividadeCorte: number) => {
  const bias = getEaseBias(agressividadeCorte);
  const newMaxY = Math.max(state.maxY, rect.y + block.h);
  const localWaste = (rect.w - block.w) * 4 + Math.min(rect.h - block.h, 500);
  const align = alignmentPenalty(x, block.w, rollW, state.blocks);
  const verticalGap = Math.max(0, rect.y - state.maxY);
  const bottomLine = rect.y + block.h;
  const bottomDistance = nearestLineDistance(bottomLine, state.horizontalLines);
  const topDistance = nearestLineDistance(rect.y, state.horizontalLines);
  const snapsBottom = bottomDistance <= bias.horizontalSnapTolerance;
  const startsOnLine = rect.y < EPS || topDistance <= EPS;
  const createsNearMissLine = !snapsBottom && bottomDistance <= bias.horizontalSnapTolerance * 2;
  const horizontalLineScore =
    (snapsBottom ? -bias.horizontalSnapWeight : bias.lineCreationWeight) +
    (createsNearMissLine ? bias.lineCreationWeight * 2 : 0) +
    (startsOnLine ? bias.shelfStartBonus : 0);
  const edgeBonus = x < EPS || Math.abs(x + block.w - rollW) < EPS ? bias.edgeBonus : 0;

  return (
    newMaxY * 10_000 +
    rect.y * 70 +
    localWaste +
    align * bias.alignmentWeight +
    verticalGap * bias.verticalGapWeight +
    horizontalLineScore +
    (block.rotated ? 8 : 0) +
    edgeBonus
  );
};

const buildCandidates = (state: BeamState, item: PackItem, rollW: number, margin: number, limit: number, agressividadeCorte: number) => {
  const candidates: PlacementCandidate[] = [];
  const orientations = getOrientations(item, margin);

  orientations.forEach((orientation) => {
    state.freeRects.forEach((rect) => {
      if (orientation.w > rect.w + EPS || orientation.h > rect.h + EPS) return;

      const x = orientation.alignRight ? rect.x + rect.w - orientation.w : rect.x;
      const block = { ...orientation, fit: { x, y: rect.y } };
      candidates.push({
        block,
        rect,
        score: placementScore(state, block, rect, x, rollW, agressividadeCorte),
      });
    });
  });

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
};

const buildFallbackCandidate = (state: BeamState, item: PackItem, rollW: number, margin: number, agressividadeCorte: number): PlacementCandidate => {
  const orientations = getOrientations(item, margin);
  const block = orientations.find((orientation) => orientation.w <= rollW + EPS) ?? orientations[0];
  const x = block.alignRight && block.w <= rollW ? rollW - block.w : 0;
  const placedBlock = { ...block, fit: { x, y: state.maxY } };
  const rect = { x: 0, y: state.maxY, w: rollW, h: STRIP_HEIGHT - state.maxY };

  return {
    block: placedBlock,
    rect,
    score: placementScore(state, placedBlock, rect, x, rollW, agressividadeCorte) + 1_000_000,
  };
};

const dedupeStates = (states: BeamState[], rollW: number, limit: number, agressividadeCorte: number) => {
  const seen = new Set<string>();
  const result: BeamState[] = [];

  states
    .sort((a, b) => stateScore(a, rollW, agressividadeCorte) - stateScore(b, rollW, agressividadeCorte))
    .forEach((state) => {
      const last = state.blocks[state.blocks.length - 1];
      const key = [
        Math.round(state.maxY),
        Math.round(last.fit?.x ?? 0),
        Math.round(last.fit?.y ?? 0),
        Math.round(last.w),
        Math.round(last.h),
        state.freeRects.slice(0, 6).map((rect) => `${Math.round(rect.x)}:${Math.round(rect.y)}:${Math.round(rect.w)}`).join('|'),
      ].join('/');

      if (!seen.has(key) && result.length < limit) {
        seen.add(key);
        result.push(state);
      }
    });

  return result;
};

const getOrderStrategies = (items: PackItem[]) => {
  const byOrder = [...items];
  const strategies = [
    byOrder,
    [...items].sort((a, b) => (b.ow * b.oh) - (a.ow * a.oh)),
    [...items].sort((a, b) => Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh)),
    [...items].sort((a, b) => b.oh - a.oh || b.ow - a.ow),
    [...items].sort((a, b) => b.ow - a.ow || b.oh - a.oh),
    [...items].sort((a, b) => Math.abs(b.ow / b.oh - 1) - Math.abs(a.ow / a.oh - 1)),
  ];

  const seen = new Set<string>();
  return strategies.filter((strategy) => {
    const key = strategy.map((item) => item.id).join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const packEasyV2 = (items: PackItem[], rollW: number, margin: number, agressividadeCorte: number) => {
  if (items.length === 0) return { blocks: [], totalY: 0, areaV: 0 };

  const beamWidth = items.length > 80 ? 8 : items.length > 45 ? 12 : 20;
  const candidateLimit = items.length > 80 ? 10 : items.length > 45 ? 14 : 22;
  let bestState: BeamState | null = null;

  for (const orderedItems of getOrderStrategies(items)) {
    let beam: BeamState[] = [{
      blocks: [],
      freeRects: [{ x: 0, y: 0, w: rollW, h: STRIP_HEIGHT }],
      maxY: 0,
      areaV: 0,
      usedArea: 0,
      rotations: 0,
      horizontalLines: [0],
    }];

    orderedItems.forEach((item) => {
      const nextStates: BeamState[] = [];

      beam.forEach((state) => {
        const candidates = buildCandidates(state, item, rollW, margin, candidateLimit, agressividadeCorte);
        const placementOptions = candidates.length > 0
          ? candidates
          : [buildFallbackCandidate(state, item, rollW, margin, agressividadeCorte)];

        placementOptions.forEach((candidate) => {
          const placed = {
            x: candidate.block.fit?.x ?? 0,
            y: candidate.block.fit?.y ?? 0,
            w: candidate.block.w,
            h: candidate.block.h,
          };
          const blocks = [...state.blocks, candidate.block];

          nextStates.push({
            blocks,
            freeRects: splitFreeRects(state.freeRects, placed),
            maxY: Math.max(state.maxY, placed.y + placed.h),
            areaV: state.areaV + candidate.block.rw * candidate.block.rh,
            usedArea: state.usedArea + candidate.block.w * candidate.block.h,
            rotations: state.rotations + (candidate.block.rotated ? 1 : 0),
            horizontalLines: mergeHorizontalLines(
              state.horizontalLines,
              placed.y + placed.h,
              getEaseBias(agressividadeCorte).horizontalSnapTolerance
            ),
          });
        });
      });

      beam = dedupeStates(nextStates, rollW, beamWidth, agressividadeCorte);
    });

    const candidateBest = beam.sort((a, b) => stateScore(a, rollW, agressividadeCorte) - stateScore(b, rollW, agressividadeCorte))[0];
    if (!bestState || stateScore(candidateBest, rollW, agressividadeCorte) < stateScore(bestState, rollW, agressividadeCorte)) {
      bestState = candidateBest;
    }
  }

  if (!bestState) return { blocks: [], totalY: 0, areaV: 0 };

  const blocks = cloneBlocks(bestState.blocks).sort((a, b) => (a.fit?.y ?? 0) - (b.fit?.y ?? 0) || (a.fit?.x ?? 0) - (b.fit?.x ?? 0));
  return { blocks, totalY: bestState.maxY, areaV: bestState.areaV };
};

const packDensity = (items: PackItem[], rollW: number, margin: number) => {
  const blocks = items
    .map((item) => toBlock(item, margin, item.forceRotate === true))
    .sort((a, b) => (b.w * b.h) - (a.w * a.h));
  let freeRects: FreeRect[] = [{ x: 0, y: 0, w: rollW, h: STRIP_HEIGHT }];
  let currentMaxY = 0;
  let currentAreaV = 0;

  blocks.forEach((block) => {
    let best: { rect: FreeRect; x: number; rotated: boolean; score: number } | null = null;
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

    for (const orientation of getOrientations(item, margin)) {
      for (const rect of freeRects) {
        if (orientation.w > rect.w + EPS || orientation.h > rect.h + EPS) continue;
        const x = orientation.alignRight ? rect.x + rect.w - orientation.w : rect.x;
        const score = rect.y * 10_000 + x + (orientation.rotated ? 5 : 0);
        if (!best || score < best.score) best = { rect, x, rotated: orientation.rotated, score };
      }
    }

    if (!best) return;

    const placedBlock = toBlock(item, margin, best.rotated);
    placedBlock.fit = { x: best.x, y: best.rect.y };
    Object.assign(block, placedBlock);

    const placed = { x: best.x, y: best.rect.y, w: block.w, h: block.h };
    freeRects = splitFreeRects(freeRects, placed);
    currentMaxY = Math.max(currentMaxY, placed.y + placed.h);
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

const packEasyLegacy = (items: PackItem[], rollW: number, margin: number) => {
  const sourceItems = items.map((item) => toBlock(item, margin, item.forceRotate === true));
  const strategies = [
    cloneBlocks(sourceItems),
    cloneBlocks(sourceItems).map((block) => {
      if (block.forceRotate !== true && block.w > block.h && block.h <= rollW) {
        return toBlock({
          id: block.id,
          ow: block.rw,
          oh: block.rh,
          cor: block.cor,
          label: block.label,
          forceRotate: true,
          alignRight: block.alignRight,
          sortOrder: block.sortOrder,
        }, margin, true);
      }
      return block;
    }),
    cloneBlocks(sourceItems).map((block) => {
      if (block.forceRotate !== true && block.h > block.w && block.h <= rollW) {
        return toBlock({
          id: block.id,
          ow: block.rw,
          oh: block.rh,
          cor: block.cor,
          label: block.label,
          forceRotate: true,
          alignRight: block.alignRight,
          sortOrder: block.sortOrder,
        }, margin, true);
      }
      return block;
    }),
  ];
  let bestResult: { totalY: number; currentAreaV: number; blocks: PackedBlock[] } | null = null;
  let minTotalY = Infinity;

  strategies.forEach((testItems) => {
    const shelves: Shelf[] = [];
    let totalY = 0;
    let currentAreaV = 0;

    testItems.forEach((item) => {
      let placed = false;
      let bestShelfIndex = -1;
      let bestColumnIndex = -1;
      let bestColumnWaste = Infinity;

      for (let i = 0; i < shelves.length; i++) {
        const shelf = shelves[i];
        for (let j = 0; j < shelf.columns.length; j++) {
          const col = shelf.columns[j];
          const remainingHeight = shelf.height - col.currentHeight;
          if (item.w <= col.width && item.h <= remainingHeight) {
            const score = (col.width - item.w) * 5 + (remainingHeight - item.h);
            if (score < bestColumnWaste) {
              bestColumnWaste = score;
              bestShelfIndex = i;
              bestColumnIndex = j;
            }
          }
        }
      }

      if (bestShelfIndex !== -1) {
        const shelf = shelves[bestShelfIndex];
        const col = shelf.columns[bestColumnIndex];
        const remainingHeight = shelf.height - col.currentHeight;
        if (remainingHeight - item.h <= 10) item.h = remainingHeight;
        item.fit = { x: col.x, y: shelf.y + col.currentHeight };
        col.blocks.push(item);
        col.currentHeight += item.h;
        placed = true;
        currentAreaV += item.rw * item.rh;
      }

      if (!placed) {
        let bestShelfForColumn = -1;
        let bestWaste = Infinity;
        for (let i = 0; i < shelves.length; i++) {
          const shelf = shelves[i];
          if (item.w <= rollW - shelf.currentWidth && item.h <= shelf.height) {
            const waste = shelf.height - item.h;
            if (waste < bestWaste) {
              bestWaste = waste;
              bestShelfForColumn = i;
            }
          }
        }
        if (bestShelfForColumn !== -1) {
          const shelf = shelves[bestShelfForColumn];
          if (shelf.height - item.h <= 10) item.h = shelf.height;
          const newColumn = { x: shelf.currentWidth, width: item.w, currentHeight: item.h, blocks: [item] };
          item.fit = { x: newColumn.x, y: shelf.y };
          shelf.columns.push(newColumn);
          shelf.currentWidth += item.w;
          placed = true;
          currentAreaV += item.rw * item.rh;
        }
      }

      if (!placed) {
        const newColumn = { x: 0, width: item.w, currentHeight: item.h, blocks: [item] };
        const newShelf = { y: totalY, height: item.h, currentWidth: item.w, columns: [newColumn] };
        item.fit = { x: 0, y: totalY };
        shelves.push(newShelf);
        totalY += item.h;
        currentAreaV += item.rw * item.rh;
      }
    });

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
      } else if (remainingWidth > 0) {
        let currentRight = rollW;
        for (let c = shelf.columns.length - 1; c >= 0; c--) {
          const col = shelf.columns[c];
          if (col.blocks.some((block) => block.alignRight === true)) {
            const nextX = currentRight - col.width;
            const shift = nextX - col.x;
            col.x = nextX;
            col.blocks.forEach((block) => {
              if (block.fit) block.fit.x += shift;
            });
            currentRight = nextX;
          } else {
            break;
          }
        }
      }
    });

    const flatBlocks = shelves.flatMap((shelf) => shelf.columns.flatMap((column) => column.blocks));
    if (totalY < minTotalY) {
      minTotalY = totalY;
      bestResult = { totalY, currentAreaV, blocks: flatBlocks };
    }
  });

  return bestResult ?? { totalY: 0, currentAreaV: 0, blocks: [] };
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
