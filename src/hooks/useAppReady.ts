import { useEffect, useState } from 'react';

/**
 * "App ready" = the user has finished onboarding and reached /launch/home.
 * Once true it stays true, so the You-Are-Here dial and other in-app
 * wayfinding surfaces appear everywhere from that point on.
 */
export const APP_READY_KEY = 'myrhythm_app_ready';
const APP_READY_EVENT = 'myrhythm-app-ready';

export function isAppReady(): boolean {
  try {
    return localStorage.getItem(APP_READY_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markAppReady() {
  try {
    if (localStorage.getItem(APP_READY_KEY) === 'true') return;
    localStorage.setItem(APP_READY_KEY, 'true');
  } catch {
    return;
  }
  window.dispatchEvent(new Event(APP_READY_EVENT));
}

export function useAppReady(): boolean {
  const [ready, setReady] = useState<boolean>(() => isAppReady());

  useEffect(() => {
    const sync = () => setReady(isAppReady());
    window.addEventListener(APP_READY_EVENT, sync);
    window.addEventListener('storage', sync);
    sync();
    return () => {
      window.removeEventListener(APP_READY_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return ready;
}
