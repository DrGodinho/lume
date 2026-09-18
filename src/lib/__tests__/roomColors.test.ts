import { describe, expect, it } from 'vitest';
import {
  resolveRoomKey,
  buildRoomColorMap,
  getRoomColorByIndex,
  ROOM_PALETTE,
  isLegacyDefaultRoomColors,
} from '../films';

describe('Room color system', () => {
  it('does not collapse distinct numbered rooms into a generic alias', () => {
    const key1 = resolveRoomKey('Quarto 1');
    const key2 = resolveRoomKey('Quarto 2');
    expect(key1).toBe('quarto 1');
    expect(key2).toBe('quarto 2');
    expect(key1).not.toBe(key2);
  });

  it('normalizes casing and whitespace for identical rooms', () => {
    expect(resolveRoomKey('  Quarto 1  ')).toBe('quarto 1');
    expect(resolveRoomKey('quarto 1')).toBe('quarto 1');
    expect(resolveRoomKey('QUARTO 1')).toBe('quarto 1');
  });

  it('assigns first room red and second room blue according to order', () => {
    const color0 = getRoomColorByIndex(0);
    const color1 = getRoomColorByIndex(1);
    const color2 = getRoomColorByIndex(2);

    expect(color0).toBe('#ef4444'); // Vermelho
    expect(color1).toBe('#3b82f6'); // Azul
    expect(color2).toBe('#10b981'); // Verde

    const items = [
      { label: 'Quarto 1' },
      { label: 'Quarto 2' },
      { label: 'Sala' },
    ];

    const map = buildRoomColorMap(items);
    expect(map['quarto 1']).toBe('#ef4444');
    expect(map['quarto 2']).toBe('#3b82f6');
    expect(map['sala']).toBe('#10b981');
  });

  it('retains color when same room appears multiple times in items list', () => {
    const items = [
      { label: 'Quarto 1' },
      { label: 'Quarto 1' },
      { label: 'Quarto 2' },
      { label: 'Quarto 1' },
    ];

    const map = buildRoomColorMap(items);
    expect(map['quarto 1']).toBe('#ef4444');
    expect(map['quarto 2']).toBe('#3b82f6');
    expect(Object.keys(map)).toHaveLength(2);
  });

  it('detects legacy hardcoded default room colors to allow clean dynamic upgrade', () => {
    const legacyMap = {
      sala: '#60a5fa',
      quarto: '#c084fc',
      cozinha: '#facc15',
    };
    expect(isLegacyDefaultRoomColors(legacyMap)).toBe(true);

    const modernMap = {
      'quarto 1': '#ef4444',
      'quarto 2': '#3b82f6',
    };
    expect(isLegacyDefaultRoomColors(modernMap)).toBe(false);
  });

  it('palette contains no violet/purple colors adhering to design rules', () => {
    const purpleHexes = ['#c084fc', '#a78bfa', '#e879f9', '#8b5cf6', '#a855f7'];
    for (const color of ROOM_PALETTE) {
      expect(purpleHexes).not.toContain(color.toLowerCase());
    }
  });
});
