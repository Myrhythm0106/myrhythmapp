import { useSyncExternalStore } from 'react';

/**
 * Global, always-visible capture state.
 *
 * The person should never have to remember whether the app is listening, or
 * navigate back to Memory Bridge to stop it. The live recorder publishes here;
 * the persistent banner reads from here and can stop the capture from anywhere.
 */
export interface CaptureStatus {
  active: boolean;
  paused: boolean;
  seconds: number;
  /** 0..1 live mic level for the little level bar */
  level: number;
  title: string | null;
}

const IDLE: CaptureStatus = {
  active: false,
  paused: false,
  seconds: 0,
  level: 0,
  title: null,
};

let status: CaptureStatus = IDLE;
let stopHandler: (() => void) | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function publishCaptureStatus(next: Partial<CaptureStatus>) {
  const merged = { ...status, ...next };
  if (
    merged.active === status.active &&
    merged.paused === status.paused &&
    merged.seconds === status.seconds &&
    Math.abs(merged.level - status.level) < 0.03 &&
    merged.title === status.title
  ) {
    return;
  }
  status = merged;
  emit();
}

export function clearCaptureStatus() {
  if (status === IDLE) return;
  status = IDLE;
  emit();
}

/** The live recorder registers how it should be stopped from the banner. */
export function registerCaptureStopHandler(handler: (() => void) | null) {
  stopHandler = handler;
}

export function requestCaptureStop() {
  stopHandler?.();
}

export function canStopCaptureHere(): boolean {
  return stopHandler !== null;
}

export function useCaptureStatus(): CaptureStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
    () => IDLE,
  );
}
