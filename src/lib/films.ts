/**
 * Domínio da calculadora (dono único — era triplicado entre AdminCalculator e ConfigPanel).
 * Tipos de película, modos, AppConfig + defaults, cores de ambiente e itens.
 */

export type FilmTypeKey =
  | 'carbono_g5'
  | 'carbono_g20'
  | 'refletiva'
  | 'dupla_camada'
  | 'nano_ceramica'
  | 'nano_ceramica_g20'
  | 'jateado'
  | 'window_blue_75'
  | 'window_blue_05'
  | 'window_blue_20'
  | 'nano_carbon_20'
  | 'nano_carbon_05'
  | 'personalizado';

export type OptimizationMode = 'densidade' | 'facilidade' | 'facilidade_v2';
export type LossMode = 'dinamico' | 'fixo';
export type ColorMode = 'ambiente' | 'tamanho';

export const OPTIMIZATION_MODES: OptimizationMode[] = ['densidade', 'facilidade', 'facilidade_v2'];
export const LOSS_MODES: LossMode[] = ['dinamico', 'fixo'];
export const COLOR_MODES: ColorMode[] = ['ambiente', 'tamanho'];
export const STANDARD_FILM_TYPE_KEYS: FilmTypeKey[] = [
  'carbono_g5',
  'carbono_g20',
  'refletiva',
  'dupla_camada',
  'nano_ceramica',
  'nano_ceramica_g20',
  'jateado',
  'window_blue_75',
  'window_blue_05',
  'window_blue_20',
  'nano_carbon_20',
  'nano_carbon_05',
];
export const FILM_TYPE_KEYS: FilmTypeKey[] = [
  ...STANDARD_FILM_TYPE_KEYS,
  'personalizado',
];

export const FILM_TYPE_LABELS: Record<FilmTypeKey, string> = {
  carbono_g5: 'Carbono G5',
  carbono_g20: 'Carbono G20',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica 75',
  nano_ceramica_g20: 'Nano Cerâmica G20',
  jateado: 'Jateado',
  window_blue_75: 'Window Blue 75%',
  window_blue_05: 'Window Blue 05%',
  window_blue_20: 'Window Blue 20%',
  nano_carbon_20: 'Nano Carbon 20%',
  nano_carbon_05: 'Nano Carbon 05%',
  personalizado: 'Personalizado...',
};

export type FilmPurchaseType = 'metro' | 'bloco_7_5m';

export interface FilmCatalogItem {
  id: string;
  name: string;
  priceSale: number;
  priceCost: number;
  purchaseType: FilmPurchaseType;
  active: boolean;
}

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
  filmCatalog?: Record<string, FilmCatalogItem>;
}

export const DEFAULT_FILM_TYPES: Record<FilmTypeKey, number> = {
  carbono_g5: 80,
  carbono_g20: 80,
  refletiva: 95,
  dupla_camada: 120,
  nano_ceramica: 220,
  nano_ceramica_g20: 180,
  jateado: 90,
  window_blue_75: 300,
  window_blue_05: 220,
  window_blue_20: 220,
  nano_carbon_20: 110,
  nano_carbon_05: 110,
  personalizado: 100,
};

export const DEFAULT_FILM_CATALOG: Record<string, FilmCatalogItem> = {
  carbono_g5: { id: 'carbono_g5', name: 'Carbono G5', priceSale: 80, priceCost: 93.75, purchaseType: 'bloco_7_5m', active: true },
  carbono_g20: { id: 'carbono_g20', name: 'Carbono G20', priceSale: 80, priceCost: 93.75, purchaseType: 'bloco_7_5m', active: true },
  refletiva: { id: 'refletiva', name: 'Refletiva', priceSale: 95, priceCost: 239.85, purchaseType: 'bloco_7_5m', active: true },
  dupla_camada: { id: 'dupla_camada', name: 'Dupla Camada', priceSale: 120, priceCost: 365.87, purchaseType: 'bloco_7_5m', active: true },
  nano_ceramica: { id: 'nano_ceramica', name: 'Nano Cerâmica 75', priceSale: 220, priceCost: 90.00, purchaseType: 'metro', active: true },
  nano_ceramica_g20: { id: 'nano_ceramica_g20', name: 'Nano Cerâmica G20', priceSale: 180, priceCost: 52.00, purchaseType: 'metro', active: true },
  jateado: { id: 'jateado', name: 'Jateado', priceSale: 90, priceCost: 239.85, purchaseType: 'bloco_7_5m', active: true },
  window_blue_75: { id: 'window_blue_75', name: 'Window Blue 75%', priceSale: 300, priceCost: 139.98, purchaseType: 'metro', active: true },
  window_blue_05: { id: 'window_blue_05', name: 'Window Blue 05%', priceSale: 220, priceCost: 69.98, purchaseType: 'metro', active: true },
  window_blue_20: { id: 'window_blue_20', name: 'Window Blue 20%', priceSale: 220, priceCost: 69.98, purchaseType: 'metro', active: true },
  nano_carbon_20: { id: 'nano_carbon_20', name: 'Nano Carbon 20%', priceSale: 110, priceCost: 262.35, purchaseType: 'bloco_7_5m', active: true },
  nano_carbon_05: { id: 'nano_carbon_05', name: 'Nano Carbon 05%', priceSale: 110, priceCost: 262.35, purchaseType: 'bloco_7_5m', active: true },
  personalizado: { id: 'personalizado', name: 'Personalizado...', priceSale: 100, priceCost: 40.00, purchaseType: 'metro', active: true },
};

const LEGACY_PLACEHOLDER_COSTS = new Set([200, 220, 280, 75, 210, 130, 95, 250]);

export const normalizeFilmCatalog = (
  rawCatalog: unknown,
  fallbackTypes?: Record<string, number>
): Record<string, FilmCatalogItem> => {
  const result: Record<string, FilmCatalogItem> = {};
  
  // 1. Inicia com o catálogo padrão com custos Bluetech
  Object.entries(DEFAULT_FILM_CATALOG).forEach(([key, item]) => {
    result[key] = { ...item };
    if (fallbackTypes && Number.isFinite(Number(fallbackTypes[key]))) {
      result[key].priceSale = Number(fallbackTypes[key]);
    }
  });

  // 2. Mescla com os dados salvos se existirem
  if (rawCatalog && typeof rawCatalog === 'object' && !Array.isArray(rawCatalog)) {
    Object.entries(rawCatalog as Record<string, unknown>).forEach(([key, val]) => {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const item = val as Partial<FilmCatalogItem>;
        const existing = result[key] || {
          id: key,
          name: typeof item.name === 'string' ? item.name : key,
          priceSale: Number(item.priceSale) || 100,
          priceCost: Number(item.priceCost) || 40,
          purchaseType: item.purchaseType === 'bloco_7_5m' ? 'bloco_7_5m' : 'metro',
          active: typeof item.active === 'boolean' ? item.active : true,
        };

        const defaultItem = DEFAULT_FILM_CATALOG[key];
        const costVal = Number(item.priceCost);
        const resolvedCost =
          defaultItem && (LEGACY_PLACEHOLDER_COSTS.has(costVal) || !Number.isFinite(costVal))
            ? defaultItem.priceCost
            : Number.isFinite(costVal)
            ? costVal
            : existing.priceCost;

        result[key] = {
          ...existing,
          name: typeof item.name === 'string' ? item.name : existing.name,
          priceSale: Number.isFinite(Number(item.priceSale)) ? Number(item.priceSale) : existing.priceSale,
          priceCost: resolvedCost,
          purchaseType: item.purchaseType === 'bloco_7_5m' ? 'bloco_7_5m' : 'metro',
          active: typeof item.active === 'boolean' ? item.active : existing.active,
        };
      }
    });
  }

  return result;
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
  filmCatalog: { ...DEFAULT_FILM_CATALOG },
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

import { SEM_AMBIENTE_LABEL } from './grouping';

export const getRoomColorByIndex = (index: number): string => {
  return ROOM_PALETTE[Math.abs(index) % ROOM_PALETTE.length];
};

export const normalizeRoomKey = (label: string) =>
  label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

export const resolveRoomKey = (label?: string | null): string => {
  const trimmed = (label || '').trim();
  return normalizeRoomKey(trimmed || SEM_AMBIENTE_LABEL);
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
    const key = resolveRoomKey(raw);
    if (!key) continue;
    if (!result[key]) {
      result[key] = getRoomColorByIndex(nextIndex);
      nextIndex++;
    }
  }

  return result;
};

export const stableRoomColor = (label?: string | null, roomColors?: Record<string, string>): string => {
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
  customFilmName?: string;
  leadId?: string | null;
  compensarPerdas?: boolean;
  modoPerdas?: LossMode;
  perdasFixas?: number;
}
