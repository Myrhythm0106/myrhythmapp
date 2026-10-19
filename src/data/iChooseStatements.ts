
import { I_CHOOSE_365, getDailyEntry } from './iChoose365';

// Annabel's #IChoose statements (adapted from #IChoose 365).
export const I_CHOOSE_STATEMENTS: string[] = I_CHOOSE_365.map((e) => e.statement);

export function getDailyStatement(): string {
  return getDailyEntry().statement;
}

export function getNextStatement(current: string): string {
  const idx = I_CHOOSE_STATEMENTS.indexOf(current);
  const next = (idx + 1) % I_CHOOSE_STATEMENTS.length;
  return I_CHOOSE_STATEMENTS[next];
}

export function todayStorageKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `myrhythm_demo_ichoose_${yyyy}-${mm}-${dd}`;
}
