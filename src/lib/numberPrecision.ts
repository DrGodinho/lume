export function roundTo(value: unknown, decimals: number) {
  const numberValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numberValue)) return 0;

  const factor = 10 ** decimals;
  return Math.round((numberValue + Number.EPSILON) * factor) / factor;
}

export function roundCurrency(value: unknown) {
  return roundTo(value, 2);
}

export function roundMeasure(value: unknown) {
  return roundTo(value, 2);
}
