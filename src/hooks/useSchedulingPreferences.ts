import { useCallback, useEffect, useState } from 'react';

export interface SchedulingPreferences {
  smartSchedulingEnabled: boolean;
  milestonesEnabled: boolean;
  healthAwareEnabled: boolean;
}

const KEY = 'myrhythm:scheduling-prefs:v1';

const DEFAULTS: SchedulingPreferences = {
  smartSchedulingEnabled: true,
  milestonesEnabled: true,
  healthAwareEnabled: true,
};

function read(): SchedulingPreferences {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function write(prefs: SchedulingPreferences) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('scheduling-prefs-changed'));
  } catch {}
}

export function useSchedulingPreferences() {
  const [prefs, setPrefs] = useState<SchedulingPreferences>(() => read());

  useEffect(() => {
    const handler = () => setPrefs(read());
    window.addEventListener('scheduling-prefs-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('scheduling-prefs-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const update = useCallback((patch: Partial<SchedulingPreferences>) => {
    setPrefs(prev => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  return { prefs, update, defaults: DEFAULTS };
}

/**
 * Merge per-action overrides over global preferences.
 */
export function resolveSchedulingPrefs(
  global: SchedulingPreferences,
  override?: Partial<SchedulingPreferences>,
): SchedulingPreferences {
  return { ...global, ...(override || {}) };
}
