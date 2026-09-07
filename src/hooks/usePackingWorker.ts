'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Block, GlassItem, OptimizationMode } from '../lib/films';

interface PackingParams {
  vidros: GlassItem[];
  rollW: number;
  margin: number;
  modoOtimizacao: OptimizationMode;
  agressividadeCorte: number;
  isCutMode: boolean;
  /** Chamado quando a lista esvazia (o pai limpa desconto/seleção). */
  onEmptyVidros?: () => void;
  /** Chamado quando a lista esvazia em modo de corte (só limpa seleção). */
  onCutModeEmpty?: () => void;
  /** Chamado quando a quantidade de peças muda (o pai zera o desconto). */
  onVidrosCountChange?: () => void;
  onError?: (msg: string) => void;
}

// C1: o `isCalculating` travava para sempre se o worker morresse.
// Timeout recria o worker e libera a UI em vez de travar no spinner.
const PACK_TIMEOUT_MS = 20000;

function createPackerWorker(
  onMessage: (data: { blocos: Block[]; maxY: number; areaV: number }) => void,
  onError: () => void,
): Worker {
  const worker = new Worker(new URL('../workers/packer.worker.ts', import.meta.url));
  worker.onmessage = (e) => onMessage(e.data);
  worker.onerror = () => onError();
  return worker;
}

function applyPackResult(
  setBlocosCalculados: React.Dispatch<React.SetStateAction<Block[]>>,
  setMaxY: React.Dispatch<React.SetStateAction<number>>,
  setAreaV: React.Dispatch<React.SetStateAction<number>>,
  setIsCalculating: React.Dispatch<React.SetStateAction<boolean>>,
  data: { blocos: Block[]; maxY: number; areaV: number },
) {
  setBlocosCalculados(data.blocos);
  setMaxY(data.maxY);
  setAreaV(data.areaV);
  setIsCalculating(false);
}

/**
 * C1: ciclo de vida do worker de otimização + resultado do cálculo.
 * Mesma lógica do god component, mais `onerror`/timeout (antes o spinner
 * podia travar ligado para sempre). Callbacks do pai via ref para não
 * reiniciar o cálculo a cada render.
 */
export function usePackingWorker({
  vidros,
  rollW,
  margin,
  modoOtimizacao,
  agressividadeCorte,
  isCutMode,
  onEmptyVidros,
  onCutModeEmpty,
  onVidrosCountChange,
  onError,
}: PackingParams) {
  const [blocosCalculados, setBlocosCalculados] = useState<Block[]>([]);
  const [maxY, setMaxY] = useState(0);
  const [areaV, setAreaV] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const prevVidrosLengthRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbacksRef = useRef({ onEmptyVidros, onCutModeEmpty, onVidrosCountChange, onError });
  useEffect(() => {
    callbacksRef.current = { onEmptyVidros, onCutModeEmpty, onVidrosCountChange, onError };
  });

  const clearPackTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const failPacking = useCallback((msg: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsCalculating(false);
    callbacksRef.current.onError?.(msg);
  }, []);

  useEffect(() => {
    workerRef.current = createPackerWorker(
      (data) => {
        clearPackTimeout();
        applyPackResult(setBlocosCalculados, setMaxY, setAreaV, setIsCalculating, data);
      },
      () => failPacking('Falha no cálculo de corte.'),
    );
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      clearPackTimeout();
    };
  }, [failPacking]);

  // Sync intencional: recalcula o packing quando os inputs mudam (paridade com o god component).
  useEffect(() => {
    if (isCutMode) {
      // Em modo de corte, apenas ocultamos os blocos apagados sem recalcular posições.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync deliberado de worker→estado
      setBlocosCalculados(prev => prev.filter(b => vidros.some(v => v.id === b.id)));
      if (vidros.length === 0) {
        callbacksRef.current.onCutModeEmpty?.();
      }
      prevVidrosLengthRef.current = vidros.length;
      return;
    }

    if (vidros.length > 0) {
      setIsCalculating(true);
      clearPackTimeout();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        // Worker preso: descarta e recria em vez de travar o spinner.
        workerRef.current?.terminate();
        workerRef.current = createPackerWorker(
          (data) => applyPackResult(setBlocosCalculados, setMaxY, setAreaV, setIsCalculating, data),
          () => failPacking('Falha no cálculo de corte.'),
        );
        failPacking('Cálculo demorou demais e foi reiniciado.');
      }, PACK_TIMEOUT_MS);
      workerRef.current?.postMessage({ vidros, rollW, margin, modoOtimizacao, agressividadeCorte });
      if (vidros.length !== prevVidrosLengthRef.current) {
        callbacksRef.current.onVidrosCountChange?.();
      }
    } else {
      setBlocosCalculados([]);
      setMaxY(0);
      setAreaV(0);
      callbacksRef.current.onEmptyVidros?.();
    }
    prevVidrosLengthRef.current = vidros.length;
  }, [vidros, rollW, margin, modoOtimizacao, agressividadeCorte, isCutMode, failPacking]);

  return { blocosCalculados, maxY, areaV, isCalculating, setIsCalculating };
}
