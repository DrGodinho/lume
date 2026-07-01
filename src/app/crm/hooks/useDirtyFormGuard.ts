'use client';

import { useEffect } from 'react';

interface UseDirtyFormGuardParams {
  isActive: boolean;
  onSave?: () => void | Promise<void>;
  onRequestClose: () => void;
}

export const useDirtyFormGuard = ({ isActive, onSave, onRequestClose }: UseDirtyFormGuardParams): void => {
  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || typeof document === 'undefined') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isSaveCombo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
      if (isSaveCombo) {
        event.preventDefault();
        if (onSave) {
          void onSave();
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onRequestClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onSave, onRequestClose]);
};
