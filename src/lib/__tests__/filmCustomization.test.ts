import { describe, expect, it } from 'vitest';
import {
  FILM_TYPE_KEYS,
  FILM_TYPE_LABELS,
  STANDARD_FILM_TYPE_KEYS,
  normalizeFilmTypeKey,
  normalizeFilmTypes,
  DEFAULT_FILM_TYPES,
} from '../films';

describe('Film Customization Domain', () => {
  it('includes standard films in STANDARD_FILM_TYPE_KEYS and excludes personalizado', () => {
    expect(STANDARD_FILM_TYPE_KEYS).toContain('carbono_g5');
    expect(STANDARD_FILM_TYPE_KEYS).toContain('refletiva');
    expect(STANDARD_FILM_TYPE_KEYS).toContain('nano_ceramica');
    expect(STANDARD_FILM_TYPE_KEYS).not.toContain('personalizado');
  });

  it('includes personalizado in FILM_TYPE_KEYS alongside standard films', () => {
    expect(FILM_TYPE_KEYS).toContain('personalizado');
    expect(FILM_TYPE_KEYS.length).toBe(STANDARD_FILM_TYPE_KEYS.length + 1);
  });

  it('provides a label for personalizado in FILM_TYPE_LABELS', () => {
    expect(FILM_TYPE_LABELS.personalizado).toBe('Personalizado...');
  });

  it('recognizes and normalizes personalizado in normalizeFilmTypeKey', () => {
    expect(normalizeFilmTypeKey('personalizado')).toBe('personalizado');
    expect(normalizeFilmTypeKey('carbono_g20')).toBe('carbono_g20');
    expect(normalizeFilmTypeKey('invalid_film')).toBe('carbono_g20');
  });

  it('normalizes film types correctly preserving personalizado price if provided', () => {
    const customTypes = normalizeFilmTypes({
      personalizado: 155.5,
      carbono_g5: 85,
    });
    expect(customTypes.personalizado).toBe(155.5);
    expect(customTypes.carbono_g5).toBe(85);
    expect(customTypes.refletiva).toBe(DEFAULT_FILM_TYPES.refletiva);
  });

  it('includes new window blue and nano carbon film types with correct default prices', () => {
    expect(STANDARD_FILM_TYPE_KEYS).toContain('window_blue_75');
    expect(STANDARD_FILM_TYPE_KEYS).toContain('window_blue_05');
    expect(STANDARD_FILM_TYPE_KEYS).toContain('window_blue_20');
    expect(STANDARD_FILM_TYPE_KEYS).toContain('nano_carbon_20');
    expect(STANDARD_FILM_TYPE_KEYS).toContain('nano_carbon_05');

    expect(DEFAULT_FILM_TYPES.window_blue_75).toBe(300);
    expect(DEFAULT_FILM_TYPES.window_blue_05).toBe(220);
    expect(DEFAULT_FILM_TYPES.window_blue_20).toBe(220);
    expect(DEFAULT_FILM_TYPES.nano_carbon_20).toBe(110);
    expect(DEFAULT_FILM_TYPES.nano_carbon_05).toBe(110);

    expect(FILM_TYPE_LABELS.window_blue_75).toBe('Window Blue 75%');
    expect(FILM_TYPE_LABELS.window_blue_05).toBe('Window Blue 05%');
    expect(FILM_TYPE_LABELS.window_blue_20).toBe('Window Blue 20%');
    expect(FILM_TYPE_LABELS.nano_carbon_20).toBe('Nano Carbon 20%');
    expect(FILM_TYPE_LABELS.nano_carbon_05).toBe('Nano Carbon 05%');
  });
});
