import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDirtyFormGuard } from '../useDirtyFormGuard';

describe('useDirtyFormGuard', () => {
  let onSave: () => Promise<void>;
  let onRequestClose: () => void;
  let onSaveMock: ReturnType<typeof vi.fn>;
  let onRequestCloseMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSaveMock = vi.fn().mockResolvedValue(undefined);
    onRequestCloseMock = vi.fn();
    onSave = onSaveMock as unknown as () => Promise<void>;
    onRequestClose = onRequestCloseMock as unknown as () => void;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when inactive (no beforeunload, no keydown)', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const docAddSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => useDirtyFormGuard({ isActive: false, onSave, onRequestClose }));

    const addedEvents = [...addSpy.mock.calls, ...docAddSpy.mock.calls].map((args) => args[0]);
    expect(addedEvents).not.toContain('beforeunload');
    expect(addedEvents).not.toContain('keydown');
  });

  it('attaches a beforeunload listener when active and detaches when inactive', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { rerender } = renderHook(({ isActive }: { isActive: boolean }) =>
      useDirtyFormGuard({ isActive, onSave, onRequestClose }), { initialProps: { isActive: true } });

    const addCall = addSpy.mock.calls.find((args) => args[0] === 'beforeunload');
    expect(addCall).toBeDefined();

    rerender({ isActive: false });

    const removeCall = removeSpy.mock.calls.find((args) => args[0] === 'beforeunload');
    expect(removeCall).toBeDefined();
  });

  it('prevents default on beforeunload so the browser shows the native warning', () => {
    renderHook(() => useDirtyFormGuard({ isActive: true, onSave, onRequestClose }));

    const event = new Event('beforeunload') as BeforeUnloadEvent;
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('calls onSave when Ctrl+S is pressed and prevents browser save', () => {
    renderHook(() => useDirtyFormGuard({ isActive: true, onSave, onRequestClose }));

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Cmd+S (Mac) is pressed', () => {
    renderHook(() => useDirtyFormGuard({ isActive: true, onSave, onRequestClose }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true, cancelable: true }));
    });

    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });

  it('calls onRequestClose when Escape is pressed', () => {
    renderHook(() => useDirtyFormGuard({ isActive: true, onSave, onRequestClose }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    });

    expect(onRequestCloseMock).toHaveBeenCalledTimes(1);
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('does not call onSave for plain key presses (no modifiers)', () => {
    renderHook(() => useDirtyFormGuard({ isActive: true, onSave, onRequestClose }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true, cancelable: true }));
    });

    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('does not handle shortcuts when inactive', () => {
    renderHook(() => useDirtyFormGuard({ isActive: false, onSave, onRequestClose }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true }));
    });

    expect(onSaveMock).not.toHaveBeenCalled();
    expect(onRequestCloseMock).not.toHaveBeenCalled();
  });
});
