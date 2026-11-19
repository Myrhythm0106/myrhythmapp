/** Home presentation choices, remembered per person on this device. */
export type HomeMode = 'dashboard' | 'list';
const k = (uid: string | undefined, name: string) => `myrhythm.home.${name}.${uid ?? 'anon'}`;
const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, v: string) => { try { localStorage.setItem(key, v); } catch { /* noop */ } };

export const getHomeMode = (uid?: string): HomeMode => (read(k(uid, 'mode')) === 'list' ? 'list' : 'dashboard');
export const setHomeMode = (uid: string | undefined, m: HomeMode) => write(k(uid, 'mode'), m);
export const getMoreOpen = (uid?: string) => read(k(uid, 'more')) === 'open';
export const setMoreOpen = (uid: string | undefined, open: boolean) => write(k(uid, 'more'), open ? 'open' : 'closed');

/** A gentle life-area label for an item. */
export function categoryFor(e: { type?: string; title?: string; source?: string }): string {
  const t = `${e.type ?? ''} ${e.title ?? ''}`.toLowerCase();
  if (/(doctor|dr\.? |gp|clinic|hospital|physio|therap|medic|prescription|appointment|health|nurse|neuro)/.test(t)) return 'Health';
  if (/(kid|child|school|family|mum|mom|dad|son|daughter|partner|birthday|grand)/.test(t)) return 'Family';
  if (/(meeting|work|report|client|call with|email|project|team|review|office|deadline)/.test(t)) return 'Work';
  if (/(shop|groceries|clean|laundry|bill|home|house|cook)/.test(t)) return 'Home';
  if (e.source === 'memory_bridge') return 'Follow-through';
  return 'Personal';
}

/** Overdue / due soon / on track from a time today. */
export function statusFor(time: string | undefined, now = new Date()): 'overdue' | 'soon' | 'ontrack' {
  const [h, m] = (time || '23:59').split(':').map(Number);
  const diff = h * 60 + (m || 0) - (now.getHours() * 60 + now.getMinutes());
  return diff < 0 ? 'overdue' : diff <= 60 ? 'soon' : 'ontrack';
}
