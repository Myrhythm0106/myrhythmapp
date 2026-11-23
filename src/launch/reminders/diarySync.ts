/** Lightweight in-page signal so every open diary view (Home, calendar, reminder card) refreshes after one changes an item. */
export const DIARY_CHANGED = 'myrhythm:diary-changed';

export function announceDiaryChange(source: string) {
  window.dispatchEvent(new CustomEvent(DIARY_CHANGED, { detail: { source } }));
}

export function onDiaryChange(source: string, fn: () => void) {
  const handler = (e: Event) => { if ((e as CustomEvent).detail?.source !== source) fn(); };
  window.addEventListener(DIARY_CHANGED, handler);
  return () => window.removeEventListener(DIARY_CHANGED, handler);
}
