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
  footprint: FreeRect;
  rect: FreeRect;
  score: number;
}

interface EaseBias {
  heightWeight: number;
  wasteWeight: number;
  localWasteWeight: number;
  fragmentationWeight: number;
  xLineWeight: number;
  yLineWeight: number;
  raggedWeight: number;
  alignmentWeight: number;
  verticalGapWeight: number;
  horizontalSnapTolerance: number;
  lineMergeTolerance: number;
  horizontalSnapWeight: number;
  lineCreationWeight: number;
  nearMissPenalty: number;
  shelfStartBonus: number;
  edgeBonus: number;
  maxSnapShift: number;
  maxLineCandidates: number;
  maxRectCandidates: number;
  maxXCandidates: number;
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

const getEaseBias = (agressividadeCorte: number): EaseBias => {
  const compactness = clamp(agressividadeCorte, 0, 100) / 100;
  const linePriority = 1 - compactness;

  return {
    heightWeight: 2_600 + compactness * 6_400,
    wasteWeight: 2.5 + compactness * 12,
    localWasteWeight: 0.7 + compactness * 1.4,
    fragmentationWeight: 120 + linePriority * 220,
    xLineWeight: 20 + linePriority * 75,
    yLineWeight: 8_000 + linePriority * 32_000,
    raggedWeight: 100 + linePriority * 220,
    alignmentWeight: 8 + linePriority * 30,
    verticalGapWeight: 85 + compactness * 260,
    horizontalSnapTolerance: 3 + linePriority * 10,
    lineMergeTolerance: 1.5 + linePriority * 2.5,
    horizontalSnapWeight: 8_000 + linePriority * 42_000,
    lineCreationWeight: 3_000 + linePriority * 18_000,
    nearMissPenalty: 8_000 + linePriority * 22_000,
    shelfStartBonus: -3_000 - linePriority * 9_000,
    edgeBonus: -300 - linePriority * 700,
    maxSnapShift: 8 + linePriority * 58,
    maxLineCandidates: compactness > 0.75 ? 3 : 4,
    maxRectCandidates: compactness > 0.75 ? 10 : 12,
    maxXCandidates: 2,
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
    state.maxY * bias.heightWeight +
    waste * bias.wasteWeight +
    state.freeRects.length * bias.fragmentationWeight +
    uniqueRoundedCount(xs) * bias.xLineWeight +
    Math.max(0, state.horizontalLines.length - 1) * bias.yLineWeight +
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

const addCandidateValue = (values: Set<number>, value: number, min: number, max: number) => {
  if (value < min - EPS || value > max + EPS) return;
  values.add(Math.round(clamp(value, min, max) * 1000) / 1000);
};

const getCandidateXs = (state: BeamState, rect: FreeRect, block: PackedBlock, rollW: number, margin: number, bias: EaseBias) => {
  const minX = rect.x;
  const maxX = rect.x + rect.w - block.w;
  const values = new Set<number>();

  addCandidateValue(values, minX, minX, maxX);
  addCandidateValue(values, maxX, minX, maxX);
  addCandidateValue(values, maxX - margin, minX, maxX);

  if (!block.alignRight) {
    addCandidateValue(values, 0, minX, maxX);
    addCandidateValue(values, rollW - block.w, minX, maxX);
    state.blocks.forEach((placed) => {
      if (!placed.fit) return;
      addCandidateValue(values, placed.fit.x, minX, maxX);
      addCandidateValue(values, placed.fit.x + placed.w - block.w, minX, maxX);
    });
  }

  return [...values]
    .sort((a, b) => {
      const aEdge = Math.min(Math.abs(a - minX), Math.abs(a - maxX));
      const bEdge = Math.min(Math.abs(b - minX), Math.abs(b - maxX));
      return aEdge - bEdge || a - b;
    })
    .slice(0, block.alignRight ? 2 : bias.maxXCandidates)
    .sort((a, b) => a - b);
};

const getCandidateYs = (state: BeamState, rect: FreeRect, block: PackedBlock, margin: number, bias: EaseBias) => {
  const minY = rect.y;
  const maxY = rect.y + rect.h - block.h;
  const values = new Set<number>();

  addCandidateValue(values, minY, minY, maxY);
  addCandidateValue(values, maxY - margin, minY, maxY);
  addCandidateValue(values, state.maxY, minY, maxY);

  state.horizontalLines.forEach((line) => {
    const topOnLine = line;
    const bottomOnLine = line - block.h;

    if (Math.abs(topOnLine - minY) <= bias.maxSnapShift) {
      addCandidateValue(values, topOnLine, minY, maxY);
    }
    if (Math.abs(bottomOnLine - minY) <= bias.maxSnapShift) {
      addCandidateValue(values, bottomOnLine, minY, maxY);
    }
  });

  return [...values]
    .sort((a, b) => Math.abs(a - minY) - Math.abs(b - minY) || a - b)
    .slice(0, bias.maxLineCandidates)
    .sort((a, b) => a - b);
};

const placementScore = (state: BeamState, block: PackedBlock, footprint: FreeRect, rect: FreeRect, x: number, y: number, rollW: number, bias: EaseBias) => {
  const newMaxY = Math.max(state.maxY, y + block.h);
  const localWaste = (rect.w - footprint.w) * 4 + Math.min(rect.h - footprint.h, 500);
  const align = alignmentPenalty(x, block.w, rollW, state.blocks);
  const verticalGap = Math.max(0, y - rect.y);
  const bottomLine = y + block.h;
  const bottomDistance = nearestLineDistance(bottomLine, state.horizontalLines);
  const topDistance = nearestLineDistance(y, state.horizontalLines);
  const snapsBottom = bottomDistance <= bias.horizontalSnapTolerance;
  const startsOnLine = y < EPS || topDistance <= bias.horizontalSnapTolerance;
  const createsTopLine = y > EPS && topDistance > bias.lineMergeTolerance;
  const createsNearMissLine = !snapsBottom && bottomDistance <= bias.horizontalSnapTolerance * 2;
  const horizontalLineScore =
    (snapsBottom ? -bias.horizontalSnapWeight : bias.lineCreationWeight) +
    (createsTopLine ? bias.lineCreationWeight * 0.75 : 0) +
    (createsNearMissLine ? bias.nearMissPenalty : 0) +
    (startsOnLine ? bias.shelfStartBonus : 0);
  const edgeBonus = x < EPS || Math.abs(x + block.w - rollW) < EPS ? bias.edgeBonus : 0;

  return (
    newMaxY * bias.heightWeight +
    y * 35 +
    localWaste * bias.localWasteWeight +
    align * bias.alignmentWeight +
    verticalGap * bias.verticalGapWeight +
    horizontalLineScore +
    (block.rotated ? 8 : 0) +
    edgeBonus
  );
};

const getCandidateRects = (rects: FreeRect[], orientation: PackedBlock, bias: EaseBias) =>
  rects
    .filter((rect) => orientation.w <= rect.w + EPS && orientation.h <= rect.h + EPS)
    .sort((a, b) => a.y - b.y || a.x - b.x || (a.w * a.h) - (b.w * b.h))
    .slice(0, bias.maxRectCandidates);

const buildCandidates = (state: BeamState, item: PackItem, rollW: number, margin: number, limit: number, bias: EaseBias) => {
  const candidates: PlacementCandidate[] = [];
  const orientations = getRawOrientations(item);

  orientations.forEach((orientation) => {
    getCandidateRects(state.freeRects, orientation, bias).forEach((rect) => {
      const xs = getCandidateXs(state, rect, orientation, rollW, margin, bias);
      const ys = getCandidateYs(state, rect, orientation, margin, bias);

      xs.forEach((x) => {
        ys.forEach((y) => {
          const block = { ...orientation, fit: { x, y } };
          const footprint = getPlacementFootprint(block, x, y, rollW, margin);
          if (!fitsInside(rect, footprint)) return;

          candidates.push({
            block,
            footprint,
            rect,
            score: placementScore(state, block, footprint, rect, x, y, rollW, bias),
          });
        });
      });
    });
  });

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
};

const buildFallbackCandidate = (state: BeamState, item: PackItem, rollW: number, margin: number, bias: EaseBias): PlacementCandidate => {
  const orientations = getRawOrientations(item);
  const block = orientations.find((orientation) => orientation.w <= rollW + EPS) ?? orientations[0];
  const x = block.alignRight && block.w <= rollW ? rollW - block.w : 0;
  const y = state.maxY;
  const placedBlock = { ...block, fit: { x, y } };
  const footprint = getPlacementFootprint(placedBlock, x, y, rollW, margin);
  const rect = { x: 0, y, w: rollW, h: STRIP_HEIGHT - y };

  return {
    block: placedBlock,
    footprint,
    rect,
    score: placementScore(state, placedBlock, footprint, rect, x, y, rollW, bias) + 1_000_000,
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
  const baseStrategies = [
    byOrder,
    [...items].sort((a, b) => (b.ow * b.oh) - (a.ow * a.oh)),
    [...items].sort((a, b) => b.oh - a.oh || b.ow - a.ow),
    [...items].sort((a, b) => b.ow - a.ow || b.oh - a.oh),
  ];
  const strategies = items.length > 80 ? baseStrategies.slice(0, 3) : baseStrategies;

  if (items.length <= 25) {
    strategies.push(
      [...items].sort((a, b) => Math.max(b.ow, b.oh) - Math.max(a.ow, a.oh)),
      [...items].sort((a, b) => Math.abs(b.ow / b.oh - 1) - Math.abs(a.ow / a.oh - 1))
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

const packEasyV2 = (items: PackItem[], rollW: number, margin: number, agressividadeCorte: number) => {
  if (items.length === 0) return { blocks: [], totalY: 0, areaV: 0 };

  const beamWidth = items.length > 120 ? 5 : items.length > 80 ? 6 : items.length > 45 ? 8 : 10;
  const candidateLimit = items.length > 120 ? 6 : items.length > 80 ? 7 : items.length > 45 ? 8 : 10;
  let bestState: BeamState | null = null;
  const baseBias = getEaseBias(agressividadeCorte);
  const bias: EaseBias = {
    ...baseBias,
    maxLineCandidates: items.length > 80 ? Math.min(baseBias.maxLineCandidates, 3) : baseBias.maxLineCandidates,
    maxRectCandidates: items.length > 80 ? Math.min(baseBias.maxRectCandidates, 8) : items.length > 45 ? Math.min(baseBias.maxRectCandidates, 10) : baseBias.maxRectCandidates,
  };

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
        const candidates = buildCandidates(state, item, rollW, margin, candidateLimit, bias);
        const placementOptions = candidates.length > 0
          ? candidates
          : [buildFallbackCandidate(state, item, rollW, margin, bias)];

        placementOptions.forEach((candidate) => {
          const placed = candidate.footprint;
          const rawBottom = (candidate.block.fit?.y ?? 0) + candidate.block.h;
          const blocks = [...state.blocks, candidate.block];

          const horizontalLines = mergeHorizontalLines(
            mergeHorizontalLines(state.horizontalLines, candidate.block.fit?.y ?? 0, bias.lineMergeTolerance),
            rawBottom,
            bias.lineMergeTolerance
          );

          nextStates.push({
            blocks,
            freeRects: splitFreeRects(state.freeRects, placed),
            maxY: Math.max(state.maxY, rawBottom),
            areaV: state.areaV + candidate.block.rw * candidate.block.rh,
            usedArea: state.usedArea + candidate.block.w * candidate.block.h,
            rotations: state.rotations + (candidate.block.rotated ? 1 : 0),
            horizontalLines,
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
