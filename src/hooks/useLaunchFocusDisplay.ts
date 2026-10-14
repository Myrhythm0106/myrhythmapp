import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const CHANGE = 'launch-focus-display-change';
const visitExpanded = new Map<string, boolean>();

export function readLocalFocusValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch { return fallback; }
}

export function writeLocalFocusValue(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing */ }
  window.dispatchEvent(new Event(CHANGE));
}

export function useLaunchFocusDisplay() {
  const { user } = useAuth();
  const key = `launch.focus-display:${user?.id ?? 'signed-out'}`;
  const read = () => readLocalFocusValue<unknown>(key, false) === true;
  const [startOpen, setStartOpen] = useState(read);
  const [expanded, setExpandedState] = useState(() => visitExpanded.get(key) ?? read());

  useEffect(() => {
    const sync = () => {
      const next = readLocalFocusValue<unknown>(key, false) === true;
      setStartOpen(next);
      setExpandedState(visitExpanded.get(key) ?? next);
    };
    sync();
    window.addEventListener(CHANGE, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  const setExpanded = useCallback((next: boolean) => {
    visitExpanded.set(key, next);
    setExpandedState(next);
    window.dispatchEvent(new Event(CHANGE));
  }, [key]);
  const setStart = (next: boolean) => {
    visitExpanded.set(key, next);
    writeLocalFocusValue(key, next);
  };
  return { startOpen, setStartOpen: setStart, expanded, setExpanded, userKey: user?.id ?? 'signed-out' };
}

export type VisionTimeframe = 'year' | 'three' | 'long';
export const VISION_TIMEFRAME_LABEL: Record<VisionTimeframe, string> = {
  year: 'This year', three: '3-year vision', long: 'Long-term vision',
};
const VISION_KEY = 'myrhythm.visionStatement.v1';
type StoredVision = { statement?: unknown; level?: unknown; levels?: Record<string, { statement?: unknown } | undefined> };

function readVision() {
  const v = readLocalFocusValue<StoredVision>(VISION_KEY, {});
  const level: VisionTimeframe = v.level === 'three' || v.level === 'long' ? v.level : 'year';
  const pick = (l: string) => {
    const s = v.levels?.[l]?.statement;
    return typeof s === 'string' ? s.trim() : '';
  };
  const yearText = pick('year') || (typeof v.statement === 'string' ? v.statement.trim() : '');
  const chosen = level === 'year' ? yearText : pick(level);
  return { level, chosen, vision: chosen || yearText };
}

/** The vision for the chosen timeframe (falls back to "This year"). */
export function useLaunchVisionTimeframe() {
  const [state, setState] = useState(readVision);
  useEffect(() => {
    const sync = () => setState(readVision());
    window.addEventListener('focus', sync);
    window.addEventListener('storage', sync);
    window.addEventListener(CHANGE, sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener(CHANGE, sync);
    };
  }, []);
  const setLevel = useCallback((level: VisionTimeframe) => {
    const v = readLocalFocusValue<Record<string, unknown>>(VISION_KEY, {});
    writeLocalFocusValue(VISION_KEY, { ...v, level });
  }, []);
  return { ...state, setLevel };
}

export function useLaunchSavedVision() {
  return useLaunchVisionTimeframe().vision;
}

export function useLaunchPriorityHighlights() {
  const { user } = useAuth();
  const key = `launch.calendar-priorities:${user?.id ?? 'signed-out'}`;
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const value = readLocalFocusValue<unknown>(key, []);
    setIds(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []);
  }, [key]);
  const toggle = (id: string) => {
    const next = ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];
    setIds(next);
    writeLocalFocusValue(key, next);
  };
  return { ids, toggle };
}