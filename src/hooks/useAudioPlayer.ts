import { useCallback, useEffect, useState } from 'react';

/**
 * One shared audio player for the whole app.
 *
 * Two things this fixes over `new Audio(url).play()`:
 *  1. The element is created *during the tap* and unlocked with a silent clip,
 *     so mobile Safari/Chrome still treat playback as user-initiated once the
 *     signed URL arrives a moment later.
 *  2. `play()` rejections are caught and surfaced instead of vanishing.
 */

// 0.05s of silence — enough to unlock the element inside a user gesture.
const SILENT_CLIP =
  'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA' +
  'gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP///////' +
  '///////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAA' +
  'AAAAJAAAAAAAAAAAAnGDs9mCAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAET' +
  'EFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV' +
  'VVVVVVVVVVVVVVVVVVVVVVVVVV';

export interface AudioPlayerSnapshot {
  /** Id of the item currently loaded in the player, if any. */
  currentId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  rate: number;
}

type Listener = (snapshot: AudioPlayerSnapshot) => void;

let element: HTMLAudioElement | null = null;
let listeners: Listener[] = [];

let snapshot: AudioPlayerSnapshot = {
  currentId: null,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  rate: 1,
};

function emit(patch: Partial<AudioPlayerSnapshot>) {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener(snapshot));
}

function ensureElement(): HTMLAudioElement {
  if (element) return element;

  const el = new Audio();
  el.preload = 'auto';

  el.addEventListener('timeupdate', () =>
    emit({ currentTime: el.currentTime }),
  );
  el.addEventListener('loadedmetadata', () =>
    emit({ duration: Number.isFinite(el.duration) ? el.duration : 0 }),
  );
  el.addEventListener('play', () => emit({ isPlaying: true, isLoading: false }));
  el.addEventListener('pause', () => emit({ isPlaying: false }));
  el.addEventListener('ended', () =>
    emit({ isPlaying: false, currentTime: 0 }),
  );

  element = el;
  return el;
}

export type PlayFailure = 'blocked' | 'unavailable' | 'failed';

interface StartOptions {
  id: string;
  /** Resolves the playable URL. Called after the element is unlocked. */
  getUrl: () => Promise<string | null>;
  onFailure?: (reason: PlayFailure, error?: unknown) => void;
}

/**
 * Must be called synchronously from a user gesture handler.
 */
export async function startPlayback({ id, getUrl, onFailure }: StartOptions) {
  const el = ensureElement();

  // Unlock inside the gesture, before any await.
  if (snapshot.currentId !== id) {
    el.pause();
    el.src = SILENT_CLIP;
    const unlock = el.play();
    if (unlock && typeof unlock.catch === 'function') unlock.catch(() => {});
    emit({
      currentId: id,
      isLoading: true,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
  }

  let url: string | null = null;
  try {
    url = await getUrl();
  } catch (error) {
    console.error('useAudioPlayer: could not resolve audio URL', error);
  }

  if (!url) {
    el.pause();
    el.removeAttribute('src');
    emit({ currentId: null, isLoading: false, isPlaying: false });
    onFailure?.('unavailable');
    return;
  }

  el.src = url;
  el.playbackRate = snapshot.rate;

  try {
    await el.play();
  } catch (error) {
    const name = (error as { name?: string })?.name;
    console.error('useAudioPlayer: play() rejected', error);
    emit({ isLoading: false, isPlaying: false });
    onFailure?.(name === 'NotAllowedError' ? 'blocked' : 'failed', error);
  }
}

export function pausePlayback() {
  element?.pause();
}

export async function resumePlayback(onFailure?: (reason: PlayFailure) => void) {
  if (!element || !element.src) return;
  try {
    await element.play();
  } catch (error) {
    const name = (error as { name?: string })?.name;
    console.error('useAudioPlayer: resume rejected', error);
    onFailure?.(name === 'NotAllowedError' ? 'blocked' : 'failed');
  }
}

export function stopPlayback() {
  if (!element) return;
  element.pause();
  element.removeAttribute('src');
  emit({
    currentId: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
  });
}

export function seekTo(seconds: number) {
  if (!element) return;
  const clamped = Math.max(0, Math.min(seconds, element.duration || seconds));
  element.currentTime = clamped;
  emit({ currentTime: clamped });
}

export function skipBy(seconds: number) {
  if (!element) return;
  seekTo((element.currentTime || 0) + seconds);
}

export function setPlaybackRate(rate: number) {
  if (element) element.playbackRate = rate;
  emit({ rate });
}

export function useAudioPlayer(): AudioPlayerSnapshot {
  const [state, setState] = useState(snapshot);

  useEffect(() => {
    const listener: Listener = (next) => setState(next);
    listeners.push(listener);
    setState(snapshot);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return state;
}

/** Convenience: player state scoped to one item id. */
export function useAudioPlayerFor(id: string) {
  const state = useAudioPlayer();
  const isCurrent = state.currentId === id;

  const toggle = useCallback(
    (options: Omit<StartOptions, 'id'>) => {
      if (isCurrent && state.isPlaying) {
        pausePlayback();
        return;
      }
      if (isCurrent && !state.isLoading) {
        void resumePlayback();
        return;
      }
      void startPlayback({ id, ...options });
    },
    [id, isCurrent, state.isPlaying, state.isLoading],
  );

  return {
    isCurrent,
    isPlaying: isCurrent && state.isPlaying,
    isLoading: isCurrent && state.isLoading,
    currentTime: isCurrent ? state.currentTime : 0,
    duration: isCurrent ? state.duration : 0,
    rate: state.rate,
    toggle,
  };
}
