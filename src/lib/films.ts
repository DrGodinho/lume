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

export const DEFAULT_ROOM_COLORS: Record<string, string> = {};

export const ROOM_PALETTE: string[] = [
  '#ef4444', // 1: Vermelho
  '#3b82f6', // 2: Azul
  '#10b981', // 3: Verde
  '#f59e0b', // 4: Âmbar / Laranja
  '#06b6d4', // 5: Ciano
  '#f43f5e', // 6: Rosa / Coral
  '#84cc16', // 7: Lima
  '#eab308', // 8: Amarelo
  '#14b8a6', // 9: Teal
  '#f97316', // 10: Laranja vivo
  '#0284c7', // 11: Azul oceano
  '#059669', // 12: Verde escuro
  '#d97706', // 13: Âmbar escuro
  '#dc2626', // 14: Vermelho carmim
  '#2dd4bf', // 15: Menta claro
  '#2563eb', // 16: Azul royal
];

export const ROOM_COLOR_SWATCHES = ROOM_PALETTE;
export const ROOM_SWATCHES = ROOM_PALETTE;

export const getRoomColorByIndex = (index: number): string => {
  return ROOM_PALETTE[Math.abs(index) % ROOM_PALETTE.length];
};

export const normalizeRoomKey = (label: string) =>
  label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

export const resolveRoomKey = (label: string): string => {
  return normalizeRoomKey(label);
};

export const isLegacyDefaultRoomColors = (colors?: Record<string, string> | null): boolean => {
  if (!colors || typeof colors !== 'object') return false;
  return colors.sala === '#60a5fa' && colors.quarto === '#c084fc';
};

export const buildRoomColorMap = (
  items: Array<string | { label?: string }>,
  existingMap: Record<string, string> = {}
): Record<string, string> => {
  const result: Record<string, string> = isLegacyDefaultRoomColors(existingMap) ? {} : { ...existingMap };
  let nextIndex = Object.keys(result).length;

  for (const item of items) {
    const raw = typeof item === 'string' ? item : item?.label;
    const key = resolveRoomKey(raw || '');
    if (!key) continue;
    if (!result[key]) {
      result[key] = getRoomColorByIndex(nextIndex);
      nextIndex++;
    }
  }

  return result;
};

export const stableRoomColor = (label: string, roomColors?: Record<string, string>): string => {
  const key = resolveRoomKey(label);
  if (!key) return '#94a3b8';
  if (roomColors && !isLegacyDefaultRoomColors(roomColors) && roomColors[key]) {
    return roomColors[key];
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return ROOM_PALETTE[Math.abs(hash) % ROOM_PALETTE.length];
};

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
