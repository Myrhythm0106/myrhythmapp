import { useSyncExternalStore } from 'react';

/**
 * Tiny global signal so the persistent capture button can show that a
 * recording is live, from anywhere in the app, without prop drilling.
 */
let live = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function setRecordingLive(next: boolean) {
  if (live === next) return;
  live = next;
  emit();
}

export function useRecordingLive(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => live,
    () => false,
  );
}
