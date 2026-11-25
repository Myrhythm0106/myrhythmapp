export interface JourneyCopy {
  firstTitle: string;
  firstHint: string;
  firstCta: string;
}

const NEUTRAL: JourneyCopy = {
  firstTitle: 'Record my first conversation',
  firstHint: 'Anything, a phone call, an appointment, or a note to myself.',
  firstCta: 'Start recording',
};

const COPY: Record<string, JourneyCopy> = {
  'brain-injury': {
    firstTitle: 'Record my first appointment',
    firstHint: 'A clinic appointment, phone call or family conversation. I can keep what was said without holding it all in my head.',
    firstCta: 'Record an appointment',
  },
  caregiver: {
    firstTitle: 'Record an appointment or family conversation',
    firstHint: 'Keep the important details for the person I support and for me, then choose what to share.',
    firstCta: 'Record a conversation',
  },
  everyday: {
    firstTitle: 'Clear one thing from my head',
    firstHint: 'Record a thought, call or conversation. MyRhythm will help me see what needs to happen next.',
    firstCta: 'Clear my head',
  },
  executive: {
    firstTitle: 'Record my first meeting',
    firstHint: 'Capture decisions, owners and deadlines, then choose what belongs in my diary.',
    firstCta: 'Record a meeting',
  },
  student: {
    firstTitle: 'Record a lecture or study conversation',
    firstHint: 'Turn what was said into notes, next steps and dates I can return to.',
    firstCta: 'Record and take notes',
  },
};

export function journeyCopyFor(rawType: string | null | undefined): JourneyCopy {
  return (rawType && COPY[rawType]) || NEUTRAL;
}

export const LANDING_AUDIENCES = [
  {
    fit: 'You are rebuilding after a brain injury or brain change',
    benefit: 'Keep appointments, care-team targets and everyday commitments together.',
  },
  {
    fit: 'You support someone you care about',
    benefit: 'Share only what you choose and make the day easier to hold together.',
  },
  {
    fit: 'You have too much to hold in your head',
    benefit: 'Turn conversations, ideas and reminders into a clear next step.',
  },
  {
    fit: 'You want to stay sharp at work',
    benefit: 'Keep meetings, owners, deadlines and follow-through in one place.',
  },
  {
    fit: 'You are studying or learning',
    benefit: 'Turn lectures and revision into notes, actions and dates.',
  },
] as const;
