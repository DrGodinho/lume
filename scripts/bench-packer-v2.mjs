import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const rootDir = process.cwd();
const workerPath = join(rootDir, 'src', 'workers', 'packer.worker.ts');
const source = readFileSync(workerPath, 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.None,
    target: ts.ScriptTarget.ES2020,
  },
});

const postedMessages = [];
const selfMock = {
  onmessage: null,
  postMessage(message) {
    postedMessages.push(message);
  },
};

vm.runInNewContext(outputText, {
  self: selfMock,
  console,
  performance,
});

if (typeof selfMock.onmessage !== 'function') {
  throw new Error('packer.worker.ts did not register self.onmessage');
}

const makeItems = (prefix, sizes) =>
  sizes.flatMap(([count, ow, oh, options = {}]) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${prefix}-${ow}x${oh}-${index + 1}`,
      ow,
      oh,
      cor: options.cor ?? '#c9a227',
      label: options.label ?? `${ow}x${oh}`,
      forceRotate: options.forceRotate,
      alignRight: options.alignRight,
      sortOrder: options.sortOrderOffset ? options.sortOrderOffset + index : index,
    }))
  );

const scenarios = [
  {
    name: 'linha-horizontal-classica',
    rollW: 152,
    margin: 3,
    vidros: makeItems('classico', [
      [3, 100, 100],
      [3, 70, 40],
    ]),
  },
  {
    name: 'banheiro-pequeno',
    rollW: 152,
    margin: 3,
    vidros: makeItems('banheiro', [
      [2, 48, 92],
      [1, 62, 80],
      [1, 40, 60],
      [1, 35, 45],
    ]),
  },
  {
    name: 'apartamento-medio',
    rollW: 152,
    margin: 3,
    vidros: makeItems('apto', [
      [4, 72, 118],
      [4, 68, 110],
      [3, 55, 95],
      [2, 42, 76],
      [2, 36, 54],
    ]),
  },
  {
    name: 'muitas-pecas-estreitas',
    rollW: 152,
    margin: 3,
    vidros: makeItems('estreitas', [
      [8, 32, 128],
      [8, 28, 118],
      [6, 24, 90],
      [4, 44, 70],
    ]),
  },
  {
    name: 'obra-mista-grande',
    rollW: 152,
    margin: 3,
    vidros: makeItems('grande', [
      [7, 75, 125],
      [6, 70, 118],
      [5, 64, 100],
      [5, 48, 92],
      [4, 38, 72],
      [4, 30, 58],
    ]),
  },
];

const runs = [
  { label: 'densidade', modoOtimizacao: 'densidade' },
  { label: 'facil-v1', modoOtimizacao: 'facilidade' },
  { label: 'v2-linhas-0', modoOtimizacao: 'facilidade_v2', agressividadeCorte: 0 },
  { label: 'v2-padrao-35', modoOtimizacao: 'facilidade_v2', agressividadeCorte: 35 },
  { label: 'v2-economia-80', modoOtimizacao: 'facilidade_v2', agressividadeCorte: 80 },
];

const groupedLineCount = (blocks, tolerance = 1.5) => {
  const lines = blocks
    .flatMap((block) => [block.fit?.y ?? 0, (block.fit?.y ?? 0) + block.h])
    .sort((a, b) => a - b);
  const groups = [];

  lines.forEach((line) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && Math.abs(lastGroup[lastGroup.length - 1] - line) <= tolerance) {
      lastGroup.push(line);
      return;
    }
    groups.push([line]);
  });

  return groups.length;
};

const runWorker = (payload) => {
  postedMessages.length = 0;
  const startedAt = performance.now();
  selfMock.onmessage({ data: payload });
  const durationMs = performance.now() - startedAt;
  const result = postedMessages[postedMessages.length - 1];

  if (!result) {
    throw new Error(`No worker result for ${payload.modoOtimizacao}`);
  }

  return { ...result, durationMs };
};

const formatNumber = (value, digits = 1) => Number(value.toFixed(digits));

const rows = scenarios.flatMap((scenario) =>
  runs.map((run) => {
    const result = runWorker({
      vidros: scenario.vidros,
      rollW: scenario.rollW,
      margin: scenario.margin,
      modoOtimizacao: run.modoOtimizacao,
      agressividadeCorte: run.agressividadeCorte,
    });
    const usedArea = result.blocos.reduce((sum, block) => sum + block.w * block.h, 0);
    const rollArea = result.maxY * scenario.rollW;
    const lineCount = groupedLineCount(result.blocos);

    return {
      cenario: scenario.name,
      algoritmo: run.label,
      pecas: scenario.vidros.length,
      altura_cm: formatNumber(result.maxY),
      perda_pct: rollArea > 0 ? formatNumber(((rollArea - usedArea) / rollArea) * 100, 2) : 0,
      linhas_h: lineCount,
      cortes_internos_h: Math.max(0, lineCount - 2),
      rotacoes: result.blocos.filter((block) => block.rotated).length,
      tempo_ms: formatNumber(result.durationMs, 1),
    };
  })
);

console.table(rows);
