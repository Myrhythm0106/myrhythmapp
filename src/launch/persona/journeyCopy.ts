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
    firstHint: 'A clinic appointment, phone call or family conversation. Keep what was said without holding it all in your head.',
    firstCta: 'Record an appointment',
  },
  caregiver: {
    firstTitle: 'Record an appointment or family conversation',
    firstHint: 'Keep the important details for the person you support and for you, then choose what to share.',
    firstCta: 'Record a conversation',
  },
  everyday: {
    firstTitle: 'Clear one thing from my head',
    firstHint: 'Record a thought, call or conversation. MyRhythm helps you see what needs to happen next.',
    firstCta: 'Clear my head',
  },
  executive: {
    firstTitle: 'Record my first meeting',
    firstHint: 'Capture decisions, owners and deadlines, then choose what belongs in my diary.',
    firstCta: 'Record a meeting',
  },
  student: {
    firstTitle: 'Record a lecture or study conversation',
    firstHint: 'Turn what was said into notes, next steps and dates you can return to.',
    firstCta: 'Record and take notes',
  },
};

export function journeyCopyFor(rawType: string | null | undefined): JourneyCopy {
  return (rawType && COPY[rawType]) || NEUTRAL;
}

export const LANDING_AUDIENCES = [
  {
    fit: 'You are rebuilding after a brain injury or brain change',
    benefit: 'I know how much slips when your brain is healing. MyRhythm holds your appointments, care-team targets and the promises you make, so you can follow through and trust yourself again.',
  },
  {
    fit: 'You support someone you care about',
    benefit: 'Caring is a lot to carry. You see only what they choose to share, and you both know what was agreed and when it is done.',
  },
  {
    fit: 'You have too much to hold in your head',
    benefit: 'When everything feels urgent, nothing lands. Every conversation and commitment becomes one clear next step, watched through to done.',
  },
  {
    fit: 'You want to stay sharp at work',
    benefit: 'Meetings, owners and deadlines in one calm place, with gentle prompts until each commitment is finished. People can count on you, again.',
  },
  {
    fit: 'You are studying or learning',
    benefit: 'Lectures and revision become clear notes, actions and dates, so what you learn today is still with you tomorrow.',
  },
] as const;
