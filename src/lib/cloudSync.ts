import { createScopedLogger } from './logger';

const logger = createScopedLogger('cloud-sync');

type CloudGlass = object;
type CloudConfig = object;

interface DraftData {
  cliente: string;
  phone: string;
  vidros: CloudGlass[];
  desconto: number;
  desconto_input: string;
  roll_w: number;
  price: number;
  margin: number;
  modo_otimizacao: string;
  user_name: string;
  selected_film: string;
  last_saved?: number;
}

const asFiniteNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

// Sanitiza o rascunho antes do envio para evitar payloads invalidos que
// quebrem o upsert (valores NaN/undefined, tipos errados, vidros corrompidos).
function sanitizeDraft(draft: DraftData): DraftData | null {
  const vidros = Array.isArray(draft.vidros)
    ? draft.vidros
        .map((glass) => {
          if (typeof glass !== 'object' || glass === null) return null;
          const cleaned: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(glass)) {
            if (value === undefined) continue;
            if (typeof value === 'number' && !Number.isFinite(value)) continue;
            cleaned[key] = value;
          }
          return cleaned;
        })
        .filter((glass): glass is Record<string, unknown> => glass !== null)
    : [];

  const rollW = asFiniteNumber(draft.roll_w);
  const price = asFiniteNumber(draft.price);
  const margin = asFiniteNumber(draft.margin);
  const desconto = asFiniteNumber(draft.desconto);
  const lastSaved = asFiniteNumber(draft.last_saved);

  return {
    cliente: typeof draft.cliente === 'string' ? draft.cliente : '',
    phone: typeof draft.phone === 'string' ? draft.phone : '',
    vidros,
    desconto: desconto ?? 0,
    desconto_input: typeof draft.desconto_input === 'string' ? draft.desconto_input : '',
    roll_w: rollW ?? 0,
    price: price ?? 0,
    margin: margin ?? 0,
    modo_otimizacao: typeof draft.modo_otimizacao === 'string' ? draft.modo_otimizacao : '',
    user_name: typeof draft.user_name === 'string' ? draft.user_name : '',
    selected_film: typeof draft.selected_film === 'string' ? draft.selected_film : '',
    ...(lastSaved !== undefined ? { last_saved: lastSaved } : {}),
  };
}

export async function saveDraftToCloud(draft: DraftData): Promise<boolean> {
  let payload: DraftData | null;
  try {
    payload = sanitizeDraft(draft);
  } catch (error) {
    logger.error('Draft sanitize failed', undefined, { message: String(error) });
    return false;
  }
  if (!payload) {
    logger.error('Draft invalid, aborting save');
    return false;
  }

  try {
    const response = await fetch('/api/calculator/draft', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      logger.error('Draft save failed', undefined, { status: response.status });
      return false;
    }
    return true;
  } catch (error) {
    logger.error('Draft save failed', undefined, { message: String(error) });
    return false;
  }
}

export async function loadDraftFromCloud(): Promise<DraftData | null> {
  try {
    const response = await fetch('/api/calculator/draft', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result = await response.json();
    return (result?.draft as DraftData) ?? null;
  } catch {
    return null;
  }
}

interface HistoryItem {
  id: string;
  cliente: string;
  phone?: string;
  data: string;
  valor: number;
  qtd: number;
  vidros: CloudGlass[];
  config: CloudConfig;
  desconto: number;
  modoOtimizacao: string;
  selectedFilm?: string;
  leadId?: string | null;
}

export async function saveHistoryItemToCloud(item: HistoryItem): Promise<boolean> {
  try {
    const response = await fetch('/api/calculator/history', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      logger.error('History save failed', undefined, { status: response.status });
      return false;
    }
    return true;
  } catch (error) {
    logger.error('History save failed', undefined, { message: String(error) });
    return false;
  }
}

export async function loadHistoryFromCloud(): Promise<HistoryItem[]> {
  try {
    const response = await fetch('/api/calculator/history', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const result = await response.json();
    const rows = (result?.items as Array<Record<string, unknown>>) ?? [];
    return rows.map((row) => ({
      id: String(row.id),
      cliente: String(row.cliente ?? ''),
      phone: row.phone ? String(row.phone) : undefined,
      data: String(row.data ?? ''),
      valor: Number(row.valor) || 0,
      qtd: Number(row.qtd) || 0,
      vidros: (row.vidros as CloudGlass[]) ?? [],
      config: (row.config as CloudConfig) ?? {},
      desconto: Number(row.desconto) || 0,
      modoOtimizacao: String(row.modo_otimizacao ?? ''),
      selectedFilm: row.selected_film ? String(row.selected_film) : undefined,
      leadId: row.lead_id ? String(row.lead_id) : null,
    }));
  } catch {
    return [];
  }
}

export async function deleteHistoryItemFromCloud(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/calculator/history?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      logger.error('History delete failed', undefined, { status: response.status });
      return false;
    }
    return true;
  } catch (error) {
    logger.error('History delete failed', undefined, { message: String(error) });
    return false;
  }
}

interface ConfigData {
  rollW: number;
  price: number;
  margin: number;
  modoOtimizacao: string;
  userName: string;
  modoPerdas: string;
  perdasFixas: number;
  modoCorConfig: string;
  agressividadeCorte: number;
  filmTypes: Record<string, number>;
  selectedFilm: string;
  draftExpiration?: number;
}

const DEFAULT_FILM_TYPES: Record<string, number> = {
  carbono_g5: 90,
  carbono_g20: 90,
  refletiva: 110,
  dupla_camada: 140,
  nano_ceramica: 240,
  nano_ceramica_g20: 180,
  jateado: 99,
};

const normalizeSelectedFilm = (value: unknown) => {
  if (value === 'carbono') return 'carbono_g20';
  return typeof value === 'string' && value ? value : 'carbono_g20';
};

const normalizeFilmTypes = (value: unknown): Record<string, number> => {
  const next = { ...DEFAULT_FILM_TYPES };
  if (!value || typeof value !== 'object') return next;

  const source = value as Record<string, unknown>;
  const legacyCarbono = Number(source.carbono);
  if (Number.isFinite(legacyCarbono)) {
    next.carbono_g5 = legacyCarbono;
    next.carbono_g20 = legacyCarbono;
  }

  Object.keys(DEFAULT_FILM_TYPES).forEach((key) => {
    const price = Number(source[key]);
    if (Number.isFinite(price)) next[key] = price;
  });

  return next;
};

export async function saveConfigToCloud(config: ConfigData): Promise<boolean> {
  const row = {
    roll_w: config.rollW,
    price: config.price,
    margin: config.margin,
    modo_otimizacao: config.modoOtimizacao,
    user_name: config.userName,
    modo_perdas: config.modoPerdas,
    perdas_fixas: config.perdasFixas,
    modo_cor_config: config.modoCorConfig,
    agressividade_corte: config.agressividadeCorte,
    film_types: normalizeFilmTypes(config.filmTypes),
    selected_film: normalizeSelectedFilm(config.selectedFilm),
    draft_expiration: config.draftExpiration,
  };

  try {
    const response = await fetch('/api/calculator/config', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      logger.error('Config save failed', undefined, {
        status: response.status,
        error: result?.error || response.statusText,
        body: row,
      });
      return false;
    }
    return true;
  } catch (error) {
    logger.error('Config save failed', undefined, { message: String(error), body: row });
    return false;
  }
}

export async function loadConfigFromCloud(): Promise<ConfigData | null> {
  try {
    const response = await fetch('/api/calculator/config', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result = await response.json();
    const data = result?.config;
    if (!data) return null;

    return {
      rollW: data.roll_w,
      price: data.price,
      margin: data.margin,
      modoOtimizacao: data.modo_otimizacao,
      userName: data.user_name,
      modoPerdas: data.modo_perdas ?? 'dinamico',
      perdasFixas: data.perdas_fixas ?? 20,
      modoCorConfig: data.modo_cor_config ?? 'tamanho',
      agressividadeCorte: data.agressividade_corte ?? 35,
      filmTypes: normalizeFilmTypes(data.film_types),
      selectedFilm: normalizeSelectedFilm(data.selected_film),
      draftExpiration: data.draft_expiration,
    };
  } catch {
    return null;
  }
}
