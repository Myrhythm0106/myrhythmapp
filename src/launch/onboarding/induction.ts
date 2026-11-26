/** One induction for new members: ordered steps, resumable, skippable, replayable. */
export const INDUCTION_STEPS = [
  'welcome', 'who', 'style',
] as const;
export type InductionStep = typeof INDUCTION_STEPS[number];

export interface InductionState { step: number; finished: boolean; dismissed: boolean }
export const FRESH: InductionState = { step: 0, finished: false, dismissed: false };

const last = INDUCTION_STEPS.length - 1;
export const clampStep = (n: number) => Math.min(last, Math.max(0, Number.isInteger(n) ? n : 0));
export const next = (s: InductionState): InductionState =>
  s.step >= last ? { ...s, finished: true } : { ...s, step: s.step + 1 };
export const back = (s: InductionState): InductionState => ({ ...s, step: clampStep(s.step - 1) });
/** Skip closes the induction for now but keeps my place. */
export const skip = (s: InductionState): InductionState => ({ ...s, dismissed: true });
export const resume = (s: InductionState): InductionState => ({ ...s, dismissed: false });
export const replay = (): InductionState => ({ ...FRESH });
export const shouldShow = (s: InductionState) => !s.finished && !s.dismissed;

export function parse(raw: string | null): InductionState {
  try {
    const p = raw ? JSON.parse(raw) : {};
    return { step: clampStep(p.step), finished: p.finished === true, dismissed: p.dismissed === true };
  } catch { return { ...FRESH }; }
}
export const storageKey = (uid?: string | null) => `myrhythm_induction:${uid ?? 'visitor'}`;
