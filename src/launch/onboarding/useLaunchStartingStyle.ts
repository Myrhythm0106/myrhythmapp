import { useSyncExternalStore } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type StartingStyle = 'guided' | 'explore';
interface StartingState {
  style: StartingStyle | null;
  step: number;
}

const EMPTY: StartingState = { style: null, step: 0 };
const EVENT = 'launch-starting-style';
const cache = new Map<string, { raw: string | null; value: StartingState }>();

function read(key: string): StartingState {
  try {
    const raw = localStorage.getItem(key);
    const previous = cache.get(key);
    if (previous?.raw === raw) return previous.value;
    const parsed = raw ? JSON.parse(raw) : {};
    const value: StartingState = {
      style: parsed.style === 'guided' || parsed.style === 'explore' ? parsed.style : null,
      step: Number.isInteger(parsed.step) ? Math.min(3, Math.max(0, parsed.step)) : 0,
    };
    cache.set(key, { raw, value });
    return value;
  } catch { return EMPTY; }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function useLaunchStartingStyle() {
  const { user } = useAuth();
  const key = `myrhythm_starting_style:${user?.id ?? 'visitor'}`;
  const state = useSyncExternalStore(subscribe, () => read(key), () => EMPTY);
  const update = (patch: Partial<StartingState>) => {
    try {
      localStorage.setItem(key, JSON.stringify({ ...read(key), ...patch }));
      window.dispatchEvent(new Event(EVENT));
    } catch { /* Storage can be unavailable in private browsing. */ }
  };
  return {
    ...state,
    chooseStyle: (style: StartingStyle) => update({ style }),
    continueStep: () => update({ step: Math.min(3, state.step + 1) }),
    restart: () => update({ style: 'guided', step: 0 }),
  };
}