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
  }, [key]);
  const setStart = (next: boolean) => {
    visitExpanded.set(key, next);
    writeLocalFocusValue(key, next);
  };
  return { startOpen, setStartOpen: setStart, expanded, setExpanded, userKey: user?.id ?? 'signed-out' };
}

export function useLaunchSavedVision() {
  const read = () => {
    const value = readLocalFocusValue<{ statement?: unknown }>('myrhythm.visionStatement.v1', {});
    return typeof value.statement === 'string' ? value.statement.trim() : '';
  };
  const [vision, setVision] = useState(read);
  useEffect(() => {
    const sync = () => setVision(read());
    window.addEventListener('focus', sync);
    window.addEventListener('storage', sync);
    window.addEventListener(CHANGE, sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener(CHANGE, sync);
    };
  }, []);
  return vision;
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