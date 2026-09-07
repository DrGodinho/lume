/**
 * Matemática de preço da calculadora — extração verbatim dos useMemo do
 * AdminCalculator (C4). Funções puras para serem testáveis; o componente
 * continua chamando-as dentro dos mesmos useMemo.
 */
import { roundCurrency } from './numberPrecision';
import type { LossMode } from './films';

export interface VidroMedida {
  ow: number;
  oh: number;
}

/** Área total em m² (medidas em cm). */
export function calcTotalAreaM2(vidros: VidroMedida[]): number {
  const area = vidros.reduce((acc, v) => acc + (v.ow * v.oh), 0);
  return area / 10000;
}

/** Subtotal bruto = área × preço do m². */
export function calcSubtotalBruto(totalAreaM2: number, price: number): number {
  return totalAreaM2 * price;
}

/** Eficiência do corte em % (0 quando sem metragem). */
export function calcEficiencia(maxY: number, areaV: number, rollW: number): number {
  return maxY > 0 ? Math.round((areaV / (maxY * rollW)) * 100) : 0;
}

export interface CompensacaoPerdaInput {
  compensarPerdas: boolean;
  modoPerdas: LossMode;
  perdasFixas: number;
  eficiencia: number;
  subtotalBruto: number;
}

/** Valor de compensação de perdas (fixo ou dinâmico). */
export function calcCompensacaoPerda({
  compensarPerdas,
  modoPerdas,
  perdasFixas,
  eficiencia,
  subtotalBruto,
}: CompensacaoPerdaInput): number {
  if (!compensarPerdas) return 0;
  if (modoPerdas === 'fixo') {
    return subtotalBruto * (perdasFixas / 100);
  }
  // dinâmico
  if (eficiencia >= 100 || eficiencia <= 0) return 0;
  return subtotalBruto * ((100 - eficiencia) / 100);
}

/** Preço final = bruto + perdas − desconto (arredondado em centavos). */
export function calcFinalPrice(subtotalBruto: number, compensacaoPerda: number, desconto: number): number {
  return roundCurrency(subtotalBruto + compensacaoPerda - desconto);
}

/** Valor prático por m² de vidro (0 quando sem área). */
export function calcValorPraticoM2(finalPrice: number, areaV: number): number {
  return areaV > 0 ? finalPrice / (areaV / 10000) : 0;
}

/** Metros lineares a comprar (maxY em cm). */
export function calcMetrosComprar(maxY: number): number {
  return maxY / 100;
}
