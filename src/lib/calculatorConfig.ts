import { buildCalculatorStorageKey } from './calculatorScope';
import {
  DEFAULT_CONFIG,
  normalizeFilmCatalog,
  normalizeFilmTypeKey,
  normalizeFilmTypes,
} from './films';
import type { AppConfig } from './films';

/** Config padrão da calculadora (movido do god component — C1). */
export function loadConfig(scopeKey?: string): AppConfig {
    try {
        const saved = localStorage.getItem(scopeKey ? buildCalculatorStorageKey('lume_config', scopeKey) : 'lume_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          const filmTypes = normalizeFilmTypes(parsed.filmTypes);
          const filmCatalog = normalizeFilmCatalog(parsed.filmCatalog, filmTypes);
          Object.entries(filmCatalog).forEach(([key, item]) => {
            if (item && Number.isFinite(item.priceSale) && item.priceSale > 0) {
              filmTypes[key as keyof typeof filmTypes] = item.priceSale;
            }
          });
          return {
            ...DEFAULT_CONFIG,
            ...parsed,
            filmTypes,
            filmCatalog,
            selectedFilm: normalizeFilmTypeKey(parsed.selectedFilm),
          };
        }
    } catch {
        return DEFAULT_CONFIG;
    }
    return DEFAULT_CONFIG;
}

export function saveConfig(cfg: AppConfig, scopeKey?: string) {
    localStorage.setItem(scopeKey ? buildCalculatorStorageKey('lume_config', scopeKey) : 'lume_config', JSON.stringify(cfg));
}
