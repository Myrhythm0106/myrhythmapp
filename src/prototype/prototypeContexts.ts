// Inferred capture contexts. The user never picks one — the extraction
// pipeline classifies the transcript and downstream cards quietly apply
// the right defaults.

export type ContextId = 'doctor' | 'family' | 'work' | 'therapy' | 'general';

export type ActType =
  | 'medication'
  | 'follow_up'
  | 'test'
  | 'referral'
  | 'lifestyle'
  | 'question'
  | 'homework'
  | 'reflection'
  | 'general';

export interface ContextConfig {
  id: ContextId;
  label: string;
  // Default people to pre-tick as invitees on medication / share-able ACTs.
  defaultShareWith: string[];
  // Whether to render the medical type chip + clinician row on the review card.
  showClinicalRow: boolean;
}

export const CONTEXTS: Record<ContextId, ContextConfig> = {
  doctor: {
    id: 'doctor',
    label: 'doctor visit',
    defaultShareWith: ['GP', 'Caregiver'],
    showClinicalRow: true,
  },
  family: {
    id: 'family',
    label: 'family meeting',
    defaultShareWith: [],
    showClinicalRow: false,
  },
  work: {
    id: 'work',
    label: 'work call',
    defaultShareWith: [],
    showClinicalRow: false,
  },
  therapy: {
    id: 'therapy',
    label: 'therapy session',
    defaultShareWith: [],
    showClinicalRow: false,
  },
  general: {
    id: 'general',
    label: 'note',
    defaultShareWith: [],
    showClinicalRow: false,
  },
};

export const CONTEXT_OPTIONS: ContextId[] = ['doctor', 'family', 'work', 'therapy', 'general'];

// Lightweight client-side classifier — used as a fallback if the edge
// function doesn't return a contextId, and as the source of truth for the
// pill on the review screen when we want to override.
const MEDICAL = /\b(mg|mcg|dose|dosage|prescription|pharmacy|scan|x-?ray|mri|referral|follow[- ]?up|appointment|symptom|blood test|specialist|consultant|gp|doctor|dr\.?|nurse|clinic|medication|metformin|tablet|pill)\b/i;
const FAMILY = /\b(mum|mom|dad|son|daughter|wife|husband|kids?|school|dinner|weekend|family|grandma|grandpa|nan)\b/i;
const WORK = /\b(project|deadline|client|deliverable|sprint|q[1-4]|quarter|meeting notes|stakeholder|launch|roadmap|kpi)\b/i;
const THERAPY = /\b(therapist|therapy|counsell?or|feelings?|anxious|anxiety|grief|trauma|coping|homework|reflect|journal)\b/i;

export function classifyContextClient(transcript: string): ContextId {
  const t = transcript || '';
  const scores: Record<ContextId, number> = {
    doctor: (t.match(MEDICAL) || []).length,
    family: (t.match(FAMILY) || []).length,
    work: (t.match(WORK) || []).length,
    therapy: (t.match(THERAPY) || []).length,
    general: 0,
  };
  let best: ContextId = 'general';
  let bestScore = 0;
  (Object.keys(scores) as ContextId[]).forEach(k => {
    if (scores[k] > bestScore) { bestScore = scores[k]; best = k; }
  });
  return bestScore >= 2 ? best : 'general';
}

// Estimate cognitive load from ACT shape — drives smart scheduling.
export function inferCognitiveLoad(args: {
  contextId?: ContextId;
  actType?: ActType;
  priority: 'high' | 'medium' | 'low';
  attendeesCount: number;
}): 'high' | 'medium' | 'low' {
  const { contextId, actType, priority, attendeesCount } = args;
  if (actType === 'follow_up' || actType === 'referral' || actType === 'test') return 'high';
  if (actType === 'medication' || actType === 'lifestyle') return 'low';
  if (contextId === 'therapy' && actType === 'reflection') return 'low';
  if (priority === 'high' && attendeesCount > 0) return 'high';
  if (priority === 'low' && attendeesCount === 0) return 'low';
  return 'medium';
}
