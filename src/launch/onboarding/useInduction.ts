import { useSyncExternalStore } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as I from './induction';

const EVENT = 'launch-induction';
const cache = new Map<string, { raw: string | null; v: I.InductionState }>();
function read(key: string) {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { /* private mode */ }
  const c = cache.get(key);
  if (c && c.raw === raw) return c.v;
  const v = I.parse(raw); cache.set(key, { raw, v }); return v;
}
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb); window.addEventListener('storage', cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', cb); };
};

export function useInduction() {
  const { user } = useAuth();
  const key = I.storageKey(user?.id);
  const state = useSyncExternalStore(subscribe, () => read(key), () => I.FRESH);
  const save = (s: I.InductionState) => {
    try { localStorage.setItem(key, JSON.stringify(s)); } catch { /* ignore */ }
    window.dispatchEvent(new Event(EVENT));
  };
  return {
    ...state,
    stepId: I.INDUCTION_STEPS[state.step],
    total: I.INDUCTION_STEPS.length,
    visible: I.shouldShow(state),
    next: () => save(I.next(read(key))),
    back: () => save(I.back(read(key))),
    skip: () => save(I.skip(read(key))),
    resume: () => save(I.resume(read(key))),
    replay: () => save(I.replay()),
  };
}
