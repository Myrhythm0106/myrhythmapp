import { useCallback, useState } from 'react';

export type ActionsView = 'table' | 'list';
const KEY = 'myrhythm:actions-view:v1';

/** Table | List choice, remembered on this device. Phones default to List. */
export function useActionsView(): [ActionsView, (v: ActionsView) => void] {
  const [view, setViewState] = useState<ActionsView>(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === 'table' || v === 'list') return v;
    } catch { /* noop */ }
    return typeof window !== 'undefined' && window.innerWidth < 1024 ? 'list' : 'table';
  });
  const setView = useCallback((v: ActionsView) => {
    try { localStorage.setItem(KEY, v); } catch { /* noop */ }
    setViewState(v);
  }, []);
  return [view, setView];
}
