/**
 * Domínio da calculadora (dono único — era triplicado entre AdminCalculator e ConfigPanel).
 * Tipos de película, modos, AppConfig + defaults, cores de ambiente e itens.
 */

export type FilmTypeKey = 'carbono_g5' | 'carbono_g20' | 'refletiva' | 'dupla_camada' | 'nano_ceramica' | 'nano_ceramica_g20' | 'jateado';
export type OptimizationMode = 'densidade' | 'facilidade' | 'facilidade_v2';
export type LossMode = 'dinamico' | 'fixo';
export type ColorMode = 'ambiente' | 'tamanho';

export const OPTIMIZATION_MODES: OptimizationMode[] = ['densidade', 'facilidade', 'facilidade_v2'];
export const LOSS_MODES: LossMode[] = ['dinamico', 'fixo'];
export const COLOR_MODES: ColorMode[] = ['ambiente', 'tamanho'];
export const FILM_TYPE_KEYS: FilmTypeKey[] = ['carbono_g5', 'carbono_g20', 'refletiva', 'dupla_camada', 'nano_ceramica', 'nano_ceramica_g20', 'jateado'];

export const FILM_TYPE_LABELS: Record<FilmTypeKey, string> = {
  carbono_g5: 'Carbono G5',
  carbono_g20: 'Carbono G20',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica 75',
  nano_ceramica_g20: 'Nano Cerâmica G20',
  jateado: 'Jateado',
};

export interface AppConfig {
  rollW: number;
  price: number;
  margin: number;
  modoOtimizacao: OptimizationMode;
  userName: string;
  modoPerdas: LossMode;
  perdasFixas: number;
  modoCorConfig: ColorMode;
  agressividadeCorte: number;
  filmTypes: Record<FilmTypeKey, number>;
  selectedFilm: FilmTypeKey;
  draftExpiration: number;
}

export const DEFAULT_FILM_TYPES: Record<FilmTypeKey, number> = {
  carbono_g5: 80,
  carbono_g20: 80,
  refletiva: 95,
  dupla_camada: 120,
  nano_ceramica: 220,
  nano_ceramica_g20: 180,
  jateado: 90,
};

export const DEFAULT_CONFIG: AppConfig = {
  rollW: 152,
  price: 80,
  margin: 3,
  modoOtimizacao: 'facilidade_v2',
  userName: 'MP Godinho',
  modoPerdas: 'dinamico',
  perdasFixas: 20,
  modoCorConfig: 'ambiente',
  agressividadeCorte: 35,
  filmTypes: { ...DEFAULT_FILM_TYPES },
  selectedFilm: 'carbono_g20',
  draftExpiration: 15,
  };

export const DEFAULT_ROOM_COLORS: Record<string, string> = {
  sala: '#60a5fa',
  cozinha: '#facc15',
  quarto: '#c084fc',
  banheiro: '#34d399',
  varanda: '#fb923c',
  area: '#f87171',
  escritorio: '#38bdf8',
  garagem: '#a78bfa',
  lavanderia: '#2dd4bf',
  hall: '#fbbf24',
  suite: '#e879f9',
  closet: '#fb7185',
  corredor: '#a3e635',
  terraco: '#f59e0b',
  jardim: '#4ade80',
  lavabo: '#22c55e',
  sacada: '#f97316',
  homeoffice: '#0ea5e9',
  sala_jantar: '#d97706',
  sala_tv: '#3b82f6',
  area_gourmet: '#f59e0b',
  area_servico: '#14b8a6',
};

export const ROOM_COLOR_SWATCHES = [
  '#60a5fa', '#facc15', '#c084fc', '#34d399', '#fb923c',
  '#f87171', '#38bdf8', '#a78bfa', '#2dd4bf', '#fbbf24',
  '#e879f9', '#fb7185', '#a3e635', '#f59e0b', '#4ade80',
];

export const ROOM_SWATCHES = [
  '#60a5fa', '#eab308', '#c084fc', '#34d399', '#fb923c',
  '#f87171', '#38bdf8', '#a78bfa', '#2dd4bf', '#fbbf24',
  '#e879f9', '#fb7185', '#a3e635', '#f59e0b', '#4ade80',
];

export const normalizeRoomKey = (label: string) =>
  label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

export const createGlassId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export const isOptimizationMode = (value: unknown): value is OptimizationMode =>
  OPTIMIZATION_MODES.includes(value as OptimizationMode);

export const isLossMode = (value: unknown): value is LossMode =>
  LOSS_MODES.includes(value as LossMode);

export const isColorMode = (value: unknown): value is ColorMode =>
  COLOR_MODES.includes(value as ColorMode);

export const isFilmTypeKey = (value: unknown): value is FilmTypeKey =>
  FILM_TYPE_KEYS.includes(value as FilmTypeKey);

export const normalizeFilmTypeKey = (value: unknown): FilmTypeKey => {
  if (value === 'carbono') return 'carbono_g20';
  return isFilmTypeKey(value) ? value : DEFAULT_CONFIG.selectedFilm;
};

export const normalizeFilmTypes = (value: unknown): Record<FilmTypeKey, number> => {
  const next = { ...DEFAULT_FILM_TYPES };
  if (!value || typeof value !== 'object') return next;

  const source = value as Record<string, unknown>;
  const legacyCarbono = Number(source.carbono);
  if (Number.isFinite(legacyCarbono)) {
    next.carbono_g5 = legacyCarbono;
    next.carbono_g20 = legacyCarbono;
  }

  FILM_TYPE_KEYS.forEach((key) => {
    const price = Number(source[key]);
    if (Number.isFinite(price)) next[key] = price;
  });

  return next;
};

export const getSizeColor = (h?: number, w?: number) => {
  if (typeof h !== 'number' || typeof w !== 'number') return '#94a3b8';
  const area = h * w;
  const hue = (area * 137.508) % 360;
  const saturation = 60 + (Math.round(area) % 20);
  const lightness = 68 + (Math.round(area * 7) % 12);
  return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`;
};

const ROOM_ALIAS_RULES: Array<{ test: RegExp; key: string }> = [
  { test: /\bsala\b.*\b(jantar)?\b/, key: 'sala_jantar' },
  { test: /\bsala\b.*\b(tv)?\b/, key: 'sala_tv' },
  { test: /\bsala\b/, key: 'sala' },
  { test: /\bcozinha\b/, key: 'cozinha' },
  { test: /\bquarto\b|\bdormitorio\b/, key: 'quarto' },
  { test: /\bsu[ií]te\b/, key: 'suite' },
  { test: /\bbanheiro\b|\btoalete\b/, key: 'banheiro' },
  { test: /\blavabo\b/, key: 'lavabo' },
  { test: /\bvaranda\b|\bsacada\b/, key: 'varanda' },
  { test: /\barea\s+gourmet\b/, key: 'area_gourmet' },
  { test: /\barea\s+de\s+servico\b|\blavanderia\b/, key: 'lavanderia' },
  { test: /\bescritorio\b|\bhome\s*office\b/, key: 'escritorio' },
  { test: /\bgaragem\b/, key: 'garagem' },
  { test: /\bhall\b/, key: 'hall' },
  { test: /\bcloset\b/, key: 'closet' },
  { test: /\bcorredor\b/, key: 'corredor' },
  { test: /\bterraco\b/, key: 'terraco' },
  { test: /\bjardim\b/, key: 'jardim' },
];

export const resolveRoomKey = (label: string) => {
  const normalized = normalizeRoomKey(label);
  if (!normalized) return '';
  const directKey = normalized.replace(/\s+/g, '_');
  if (DEFAULT_ROOM_COLORS[directKey]) return directKey;
  const matched = ROOM_ALIAS_RULES.find((r) => r.test.test(normalized));
  if (matched && DEFAULT_ROOM_COLORS[matched.key]) return matched.key;
  return directKey;
};

export const stableRoomColor = (label: string) => {
  const normalized = normalizeRoomKey(label);
  if (!normalized) return '#94a3b8';
  const key = resolveRoomKey(label);
  if (DEFAULT_ROOM_COLORS[key]) return DEFAULT_ROOM_COLORS[key];
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return ROOM_SWATCHES[Math.abs(hash) % ROOM_SWATCHES.length];
};

export interface GlassItem {
  id: string;
  h: number;
  w: number;
  oh: number;
  ow: number;
  label?: string;
  cor: string;
  forceRotate?: boolean;
  alignRight?: boolean;
  sortOrder: number;
}

export interface Block {
  id: string;
  w: number;
  h: number;
  rw: number;
  rh: number;
  cor: string;
  label?: string;
  fit?: { x: number; y: number };
  rotated?: boolean;
  h_visual?: number;
  forceRotate?: boolean;
  alignRight?: boolean;
  sortOrder?: number;
}

export interface OrcamentoSalvo {
  id: string;
  cliente: string;
  phone?: string;
  neighborhood?: string;
  data: string;
  valor: number;
  qtd: number;
  vidros: GlassItem[];
  config: {
    rollW: number;
    price: number;
    margin: number;
    compensarPerdas?: boolean;
    modoPerdas?: LossMode;
    perdasFixas?: number;
  };
  desconto: number;
  modoOtimizacao: OptimizationMode;
  selectedFilm?: string;
  leadId?: string | null;
  compensarPerdas?: boolean;
  modoPerdas?: LossMode;
  perdasFixas?: number;
}
