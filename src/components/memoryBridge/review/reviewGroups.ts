export type ReviewGroup = 'steps' | 'guidance' | 'suggestions';

/** Presentation labels, not a claim that a model-inferred action was agreed. */
export function reviewGroup(action: {
  category?: string | null;
  confidence_score?: number | null;
  extraction_method?: string | null;
}): ReviewGroup {
  if (['note', 'watch_out', 'depends_on'].includes(action.category || '')) return 'guidance';
  if (action.extraction_method === 'user_added' || action.extraction_method === 'manual') return 'steps';
  if (action.confidence_score != null && action.confidence_score < 0.65) return 'suggestions';
  return 'steps';
}

/**
 * Only steps that are clearly the person's own, or clearly said in the
 * conversation, start ticked. Anything inferred waits for an explicit choice.
 */
export function startsSelected(action: {
  category?: string | null;
  confidence_score?: number | null;
  extraction_method?: string | null;
  requires_review?: boolean | null;
}): boolean {
  if (reviewGroup(action) !== 'steps') return false;
  if (action.extraction_method === 'user_added' || action.extraction_method === 'manual') return true;
  if (action.requires_review) return false;
  return Number(action.confidence_score ?? 1) >= 0.8;
}

export const REVIEW_GROUPS = [
  { id: 'steps', title: 'My next steps', hint: 'I check what I want to carry through.' },
  { id: 'guidance', title: 'Guidance to keep', hint: 'Information from my conversation. I only schedule it if I choose.' },
  { id: 'suggestions', title: 'Suggestions to consider', hint: 'Possible steps, not promises I make. I choose what fits.' },
] as const;