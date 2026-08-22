'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
}

/**
 * Detecta o gesto "puxar para atualizar" no topo de um container rolável em
 * dispositivos de toque. Só ativa quando o scroll vertical está no topo (0).
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 72,
  disabled = false,
}: PullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const distance = useRef(0);
  const refreshingRef = useRef(false);

  const reset = useCallback(() => {
    distance.current = 0;
    setPullDistance(0);
  }, []);

  const triggerRefresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
      reset();
    }
  }, [onRefresh, reset]);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return undefined;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return undefined;

    const onTouchStart = (event: TouchEvent) => {
      if (refreshingRef.current) return;
      if (window.scrollY > 0) {
        startY.current = null;
        return;
      }
      startY.current = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (startY.current === null || refreshingRef.current) return;
      const delta = event.touches[0].clientY - startY.current;
      if (delta <= 0) {
        reset();
        return;
      }
      if (event.cancelable) event.preventDefault();
      const next = Math.min(delta * 0.5, threshold + 48);
      distance.current = next;
      setPullDistance(next);
    };

    const onTouchEnd = () => {
      if (startY.current === null) return;
      startY.current = null;
      if (distance.current >= threshold) {
        void triggerRefresh();
      } else {
        reset();
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [disabled, threshold, triggerRefresh, reset]);

  return { pullDistance, refreshing, threshold };
}
