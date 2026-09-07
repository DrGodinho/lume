import { buildCalculatorStorageKey } from './calculatorScope';
import {
  DEFAULT_CONFIG,
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
          return {
            ...DEFAULT_CONFIG,
            ...parsed,
            filmTypes: normalizeFilmTypes(parsed.filmTypes),
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
