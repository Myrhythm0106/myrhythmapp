/** How the person said MyRhythm should place steps: ask first, suggest a time, or place it with Undo. */
export type ControlStyle = 'ask' | 'suggest' | 'place';

export interface PlacementRule { confirmFirst: boolean; offerTimes: boolean; undo: boolean }

export function placementRule(style: ControlStyle | null | undefined): PlacementRule {
  if (style === 'place') return { confirmFirst: false, offerTimes: false, undo: true };
  if (style === 'suggest') return { confirmFirst: true, offerTimes: true, undo: false };
  // 'ask' and no answer yet: never place without a yes.
  return { confirmFirst: true, offerTimes: false, undo: false };
}

export function readControlStyle(userId?: string | null): ControlStyle | null {
  try {
    const v = localStorage.getItem(`myrhythm_control_style_v1:${userId ?? 'signed-out'}`)
      ?? localStorage.getItem('myrhythm_control_style_v1:signed-out');
    return v === 'ask' || v === 'suggest' || v === 'place' ? v : null;
  } catch { return null; }
}
