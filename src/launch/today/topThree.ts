export interface TopItem { id: string; text: string; done: boolean }
export const MAX_TOP = 3;

export function dayKey(userId: string | undefined, d = new Date()): string {
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `myrhythm.top3.${userId ?? 'guest'}.${iso}`;
}

export function loadTop(key: string): TopItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v.slice(0, MAX_TOP) : [];
  } catch { return []; }
}

export function saveTop(key: string, items: TopItem[]) {
  try { localStorage.setItem(key, JSON.stringify(items.slice(0, MAX_TOP))); } catch { /* noop */ }
}

export function addTop(items: TopItem[], text: string): TopItem[] {
  const t = text.trim();
  if (!t || items.length >= MAX_TOP) return items;
  return [...items, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text: t, done: false }];
}
