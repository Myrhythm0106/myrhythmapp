// MyRhythm Playbook — single typed source of truth.
//
// This file generates ALL THREE surfaces:
//   1. The Google Sheet (.xlsx)  — src/founder/playbookXlsx.ts
//   2. The narrative doc         — docs/playbook.md
//   3. The app page              — /founder/playbook
//
// The `key` column is the contract between the sheet and the app.
// Never change an existing key: uploads match rows by key.
//
// H0 (the Launch Plan) is the primary horizon. H1–H4 are planning
// artefacts only — no features are built ahead of their horizon.
//
// All copy here must pass docs/claims-policy.md: no clinical outcome
// language in rehab- or investor-facing rows.

export type PlaybookStatus = 'Not started' | 'In progress' | 'Done' | 'Blocked';

export const PLAYBOOK_STATUSES: PlaybookStatus[] = [
  'Not started',
  'In progress',
  'Done',
  'Blocked',
];

export const PLAYBOOK_VERSION = 'v1.0';
export const PLAYBOOK_FOOTER =
  'MyRhythm · Confidential — Not medical advice. Playbook ' + PLAYBOOK_VERSION + '.';

export type HorizonId = 'H0' | 'H1' | 'H2' | 'H3' | 'H4';

/* ------------------------------------------------------------------ */
/* Horizons                                                            */
/* ------------------------------------------------------------------ */

export interface Horizon {
  key: HorizonId;
  name: string;
  window: string;
  question: string;
  outcome: string;
  exitGate: string;
  gateDate: string;
}

export const HORIZONS: Horizon[] = [
  {
    key: 'H0',
    name: 'Launch Plan (primary)',
    window: 'Aug – Dec 2026',
    question: 'Is it real, used, and paid for?',
    outcome:
      'MVP is in the hands of friends and family, then publicly on sale before Christmas, then packaged for rehab centres.',
    exitGate: 'G1 · G2 · G3 all passed',
    gateDate: '2027-01-30',
  },
  {
    key: 'H1',
    name: '6 months',
    window: 'Jan – Jun 2027',
    question: 'Does it retain, and will a centre pilot it?',
    outcome:
      'People keep using it after the novelty wears off, and one rehab service runs a structured pilot.',
    exitGate: '1 signed pilot; 30-day retention target held',
    gateDate: '2027-06-30',
  },
  {
    key: 'H2',
    name: '1 year',
    window: 'Jul – Dec 2027',
    question: 'Does it repeat without me pushing it?',
    outcome:
      'Acquisition happens without founder-led selling on every single member, and the first renewals land.',
    exitGate: 'Repeatable acquisition channel + first renewal cohort',
    gateDate: '2027-12-31',
  },
  {
    key: 'H3',
    name: '18 months',
    window: 'Jan – Jun 2028',
    question: 'Is it a business or a project?',
    outcome:
      'The path to break-even is proven on real numbers and a second cohort is live.',
    exitGate: 'Break-even path proven; second cohort live',
    gateDate: '2028-06-30',
  },
  {
    key: 'H4',
    name: '5 years',
    window: '2028 – 2031',
    question: 'What is the category position?',
    outcome:
      'MyRhythm owns the follow-through category, with a research corpus and a defended IP portfolio.',
    exitGate: 'Category ownership, research corpus, IP portfolio',
    gateDate: '2031-12-31',
  },
];

/* ------------------------------------------------------------------ */
/* Gates                                                               */
/* ------------------------------------------------------------------ */

export interface Gate {
  key: string;
  horizon: HorizonId;
  name: string;
  date: string;
  passCondition: string;
}

export const GATES: Gate[] = [
  {
    key: 'G1',
    horizon: 'H0',
    name: 'Friends & Family',
    date: '2026-08-21',
    passCondition:
      '10 invited testers complete sign-up → assessment → one full 4C loop on their own phone, with zero P0 bugs open.',
  },
  {
    key: 'G2',
    horizon: 'H0',
    name: 'Public launch',
    date: '2026-12-11',
    passCondition:
      'Public checkout live, 25 paying members, mobile pass on iOS + Android, data export working, disclaimers on every surface.',
  },
  {
    key: 'G3',
    horizon: 'H0',
    name: 'Rehab-ready',
    date: '2027-01-30',
    passCondition:
      'Continuity Report exportable for a real member, clinician one-pager printed and reviewed, 3 clinician conversations held.',
  },
  {
    key: 'G-H1',
    horizon: 'H1',
    name: 'Pilot gate',
    date: '2027-06-30',
    passCondition: 'One signed rehab pilot; 30-day retention target held.',
  },
  {
    key: 'G-H2',
    horizon: 'H2',
    name: 'Repeatability gate',
    date: '2027-12-31',
    passCondition:
      'One acquisition channel produces members two months running without founder-led selling; first renewals collected.',
  },
  {
    key: 'G-H3',
    horizon: 'H3',
    name: 'Viability gate',
    date: '2028-06-30',
    passCondition: 'Break-even path proven on real unit economics; second cohort live.',
  },
  {
    key: 'G-H4',
    horizon: 'H4',
    name: 'Category gate',
    date: '2031-12-31',
    passCondition:
      'MyRhythm is cited as the follow-through category reference; research corpus published; IP portfolio granted.',
  },
];

/* ------------------------------------------------------------------ */
/* 20-week plan (H0)                                                   */
/* ------------------------------------------------------------------ */

export interface PlanWeek {
  key: string;
  week: number;
  dates: string;
  startDate: string;
  theme: string;
  outcomes: string[];
  target: string;
  owner: string;
}

const WEEK_THEMES: Array<{
  theme: string;
  outcomes: string[];
  target: string;
  owner: string;
}> = [
  {
    theme: 'Freeze the MVP scope',
    outcomes: [
      'MVP checklist agreed and frozen — nothing added after today',
      'Playbook sheet in Drive and in use',
      'Tester list of 10 named people written down',
    ],
    target: 'Scope frozen',
    owner: 'Founder',
  },
  {
    theme: 'Close the P0 bugs',
    outcomes: [
      'Every P0 on the checklist fixed',
      'Sign-up → assessment → home runs clean on a real phone',
      'Access codes issued to the 10 testers',
    ],
    target: '0 P0 open',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'Friends & Family gate (G1)',
    outcomes: [
      'All 10 testers onboarded',
      'Feedback captured in founding_feedback',
      'G1 passed or a written reason it slipped',
    ],
    target: 'G1 passed 21 Aug',
    owner: 'Founder',
  },
  {
    theme: 'Fix what the testers hit',
    outcomes: [
      'Top 5 friction points fixed',
      'Empty and error states reviewed on every core screen',
      'Second pass on mobile touch targets',
    ],
    target: 'Top 5 fixed',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'IP groundwork',
    outcomes: [
      'Copyright notices and assignment hygiene complete',
      'UK IPO trademark application filed (classes 9/42/44)',
      'NDA template ready for clinician conversations',
    ],
    target: 'UK filing in',
    owner: 'Founder',
  },
  {
    theme: 'Continuity Report hardening',
    outcomes: [
      'Report runs on a real member account end to end',
      'PDF footer and claim language checked against claims policy',
      'Metric definitions written into the sheet',
    ],
    target: 'Report signed off',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'Second tester wave',
    outcomes: [
      '10 more testers invited',
      'Support Circle invite tested by a real second person',
      'Weekly metrics row started in the sheet',
    ],
    target: '20 testers total',
    owner: 'Founder',
  },
  {
    theme: 'Payments and pricing live in test',
    outcomes: [
      'Stripe test mode flow end to end',
      'Pricing ladder copy final on the subscribe page',
      'Refund and cancel paths written down',
    ],
    target: 'Checkout test-clean',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'Story and assets',
    outcomes: [
      'Founder story written',
      'Three screenshots and one 90-second walkthrough recorded',
      'Landing page copy matches the locked definition',
    ],
    target: 'Assets ready',
    owner: 'Founder',
  },
  {
    theme: 'Clinician conversation 1',
    outcomes: [
      'First clinician conversation held using the intro script',
      'Clinician one-pager printed on A4 and reviewed',
      'Objections logged',
    ],
    target: '1 conversation',
    owner: 'Founder',
  },
  {
    theme: 'Retention pass',
    outcomes: [
      'Daily Brief and weekly planning reviewed for load',
      'One friction removed from the 4C loop',
      'Reminder tone options checked with two testers',
    ],
    target: 'One friction removed',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'Data and privacy',
    outcomes: [
      'Data export verified for a real member',
      'DPIA drafted',
      'Retention policy visible in settings',
    ],
    target: 'DPIA drafted',
    owner: 'Founder',
  },
  {
    theme: 'US filing and legal tidy',
    outcomes: [
      'USPTO trademark filed',
      'Trade-secret register started',
      'Contractor and helper assignments signed',
    ],
    target: 'US filing in',
    owner: 'Founder',
  },
  {
    theme: 'Pre-launch hardening',
    outcomes: [
      'Full regression on the 9 core routes',
      'Mobile pass on iOS and Android',
      'Error monitoring reviewed daily',
    ],
    target: 'Regression green',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'Clinician conversations 2 and 3',
    outcomes: [
      'Two more conversations held',
      'Continuity Report shown to a clinician',
      'Standards-alignment panel wording adjusted from feedback',
    ],
    target: '3 total',
    owner: 'Founder',
  },
  {
    theme: 'Launch runway',
    outcomes: [
      'Launch email sequence written and scheduled',
      'Founding Member seats and codes ready',
      'Support inbox and response times agreed',
    ],
    target: 'Sequence scheduled',
    owner: 'Founder',
  },
  {
    theme: 'Soft open',
    outcomes: [
      'Checkout live for a small list',
      'First real payments taken',
      'Day-one support watched closely',
    ],
    target: 'First paid members',
    owner: 'Founder',
  },
  {
    theme: 'Public launch (G2)',
    outcomes: [
      'Public launch executed',
      '25 paying members',
      'G2 passed or a written reason it slipped',
    ],
    target: 'G2 passed 11 Dec',
    owner: 'Founder',
  },
  {
    theme: 'Stabilise',
    outcomes: [
      'Every launch-week bug triaged',
      'Metrics row filled for launch week',
      'One retention fix shipped',
    ],
    target: 'Backlog triaged',
    owner: 'Founder + Lovable',
  },
  {
    theme: 'Rehab packaging',
    outcomes: [
      'Rehab pack assembled: Continuity Report sample, one-pager, claims policy',
      'Target list of 10 services written',
      'Year-end review written into the sheet',
    ],
    target: 'Rehab pack ready',
    owner: 'Founder',
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtRange(start: Date, end: Date) {
  const sm = MONTHS[start.getUTCMonth()];
  const em = MONTHS[end.getUTCMonth()];
  return sm === em
    ? `${start.getUTCDate()}–${end.getUTCDate()} ${em}`
    : `${start.getUTCDate()} ${sm} – ${end.getUTCDate()} ${em}`;
}

/** Week 1 opens Wed 5 Aug 2026; weeks 2+ run Mon–Sun. */
export const PLAN_WEEKS: PlanWeek[] = WEEK_THEMES.map((w, i) => {
  const start = i === 0 ? new Date(Date.UTC(2026, 7, 5)) : new Date(Date.UTC(2026, 7, 10 + (i - 1) * 7));
  const end = i === 0 ? new Date(Date.UTC(2026, 7, 9)) : new Date(start.getTime() + 6 * 864e5);
  return {
    key: `W${String(i + 1).padStart(2, '0')}`,
    week: i + 1,
    dates: fmtRange(start, end),
    startDate: iso(start),
    ...w,
  };
});

/* ------------------------------------------------------------------ */
/* MVP checklist                                                       */
/* ------------------------------------------------------------------ */

export interface ChecklistItem {
  key: string;
  group: string;
  item: string;
  doneLine: string;
  owner: string;
  due: string;
}

const CHECK: Array<[string, string, string, string, string]> = [
  ['4C loop', 'Capture works from home in one tap', 'A new member can capture something within 10 seconds of opening the app', 'Founder + Lovable', '2026-08-14'],
  ['4C loop', 'Commit turns a capture into a dated action', 'Every capture can become a calendar-visible action without leaving the screen', 'Founder + Lovable', '2026-08-14'],
  ['4C loop', 'Calibrate handles a missed day without shame language', 'Missing a day offers reschedule, not a failure state', 'Founder + Lovable', '2026-08-21'],
  ['4C loop', 'Celebrate records a win', 'A completed commitment produces a visible, dated win', 'Founder + Lovable', '2026-08-21'],
  ['Memory Bridge', 'Recording runs to the tier cap without dropping', 'A 30-minute recording completes and transcribes on a real phone', 'Founder + Lovable', '2026-08-28'],
  ['Memory Bridge', 'Remaining-time countdown persists across refresh', 'Closing and reopening the app shows the same remaining minutes', 'Lovable', '2026-08-28'],
  ['Memory Bridge', 'Extracted actions can be accepted or rejected', 'Nothing lands in the calendar without the member accepting it', 'Founder + Lovable', '2026-09-04'],
  ['Calendar', 'Add Event covers type, reminder tone, invites and recurrence', 'All four options set on one event and survive a reload', 'Lovable', '2026-09-04'],
  ['Calendar', 'Reminders fire at the chosen intensity', 'Gentle, Steady and Strong each produce the expected number of nudges', 'Founder + Lovable', '2026-09-11'],
  ['Support Circle', 'Invite a real person by email', 'An invitee receives, accepts and appears in the circle', 'Founder', '2026-08-21'],
  ['Support Circle', 'Permissions are explicit and revocable', 'A member can see exactly what each person can view and remove them', 'Lovable', '2026-09-11'],
  ['Access & payments', 'Access codes gate the cohort', 'An invalid code is refused; a valid code admits once', 'Lovable', '2026-08-14'],
  ['Access & payments', 'Stripe test mode end to end', 'Test card completes checkout and the member lands on welcome', 'Founder', '2026-09-25'],
  ['Data', 'Member can export their own data', 'Export produces a readable file containing their captures, actions and wins', 'Lovable', '2026-10-16'],
  ['Data', 'Continuity Report runs for a real member', '30/60/90 PDF generates with correct follow-through numbers', 'Founder + Lovable', '2026-09-18'],
  ['Safety', 'Disclaimers on every clinical-adjacent surface', 'No screen implies diagnosis or treatment; claims policy check passes', 'Founder', '2026-09-18'],
  ['Quality', 'Mobile pass on iOS and Android', 'Core flow completed on both without pinch-zoom or overflow', 'Founder', '2026-11-13'],
  ['Quality', 'Error and empty states on every core screen', 'No blank screen anywhere; every failure says what to do next', 'Lovable', '2026-11-13'],
];

export const MVP_CHECKLIST: ChecklistItem[] = CHECK.map(([group, item, doneLine, owner, due], i) => ({
  key: `MVP${String(i + 1).padStart(2, '0')}`,
  group,
  item,
  doneLine,
  owner,
  due,
}));

/* ------------------------------------------------------------------ */
/* IP & Legal                                                          */
/* ------------------------------------------------------------------ */

export interface LegalItem {
  key: string;
  area: string;
  action: string;
  why: string;
  owner: string;
  cost: string;
  due: string;
}

const LEGAL: Array<[string, string, string, string, string, string]> = [
  ['Copyright', 'Add © MyRhythm notices to app, docs and exports', 'Copyright exists automatically, but visible notice sets the record and deters copying', 'Founder', '£0', '2026-09-04'],
  ['Copyright', 'Keep a dated archive of each release build', 'Dated evidence of authorship is what wins a dispute', 'Founder', '£0', '2026-09-04'],
  ['Trademark', 'File MyRhythm at UK IPO, classes 9, 42, 44', 'The name is the asset a rehab service repeats — protect it before publicity', 'Founder', '£170–£370', '2026-09-11'],
  ['Trademark', 'File at USPTO, same classes', 'US market is in the 5-year plan; early filing preserves priority', 'Founder', '$250–$350 per class', '2026-11-06'],
  ['Trademark', 'Register Memory-First Design™ as a secondary mark', 'It is the external category descriptor and must not be genericised', 'Founder', '£170+', '2026-11-06'],
  ['Assignment', 'Written IP assignment from every contractor or helper', 'Without assignment, whoever wrote it owns it — this kills funding rounds', 'Founder', '£0–£300', '2026-11-06'],
  ['Confidentiality', 'Mutual NDA template for clinician and partner conversations', 'Protects the concept before the trademark and filings land', 'Founder', '£0–£250', '2026-09-11'],
  ['Trade secrets', 'Register of what is confidential: prompts, scoring, metric definitions', 'The concept is not patentable; secrecy plus contract is the real moat', 'Founder', '£0', '2026-10-16'],
  ['Data', 'DPIA for member and Support Circle data', 'Required posture before any rehab service will talk seriously', 'Founder', '£0–£1,500', '2026-10-23'],
  ['Data', 'Processor agreements with each vendor', 'A centre will ask who touches the data before anything else', 'Founder', '£0', '2026-10-23'],
  ['Claims', 'Annual claims-policy audit of all public copy', 'Overclaiming once ends the clinical conversation permanently', 'Founder', '£0', '2026-12-04'],
];

export const LEGAL_ITEMS: LegalItem[] = LEGAL.map(([area, action, why, owner, cost, due], i) => ({
  key: `IP${String(i + 1).padStart(2, '0')}`,
  area,
  action,
  why,
  owner,
  cost,
  due,
}));

/* ------------------------------------------------------------------ */
/* Objectives & key results (H1–H4)                                    */
/* ------------------------------------------------------------------ */

export interface Objective {
  key: string;
  horizon: HorizonId;
  objective: string;
  keyResults: Array<{ key: string; kr: string; baseline: string; target: string; due: string }>;
  bets: string[];
  nonBets: string[];
}

export const OBJECTIVES: Objective[] = [
  {
    key: 'O-H1-1',
    horizon: 'H1',
    objective: 'Prove people keep going after the novelty wears off',
    keyResults: [
      { key: 'KR-H1-1a', kr: '30-day retention of paying members', baseline: '—', target: '45%', due: '2027-06-30' },
      { key: 'KR-H1-1b', kr: 'Median weekly follow-through rate', baseline: '—', target: '60%', due: '2027-06-30' },
      { key: 'KR-H1-1c', kr: 'Members with an active Support Circle member', baseline: '—', target: '50%', due: '2027-06-30' },
    ],
    bets: ['Reduce the loop to the smallest daily action that still counts', 'Support Circle as the retention mechanism, not notifications'],
    nonBets: ['Gamification', 'New personas', 'Native apps'],
  },
  {
    key: 'O-H1-2',
    horizon: 'H1',
    objective: 'Get one rehab service to run a structured pilot',
    keyResults: [
      { key: 'KR-H1-2a', kr: 'Signed pilot agreements', baseline: '0', target: '1', due: '2027-06-30' },
      { key: 'KR-H1-2b', kr: 'Clinician conversations held', baseline: '3', target: '15', due: '2027-06-30' },
      { key: 'KR-H1-2c', kr: 'Continuity Reports shared with a clinician (with consent)', baseline: '0', target: '10', due: '2027-06-30' },
    ],
    bets: ['Lead with the Continuity Report, not the app tour'],
    nonBets: ['Procurement-heavy NHS trusts before an independent service says yes'],
  },
  {
    key: 'O-H2-1',
    horizon: 'H2',
    objective: 'Make acquisition repeat without founder-led selling',
    keyResults: [
      { key: 'KR-H2-1a', kr: 'Members acquired without a founder call', baseline: '—', target: '60%', due: '2027-12-31' },
      { key: 'KR-H2-1b', kr: 'Referral-sourced members', baseline: '—', target: '25%', due: '2027-12-31' },
      { key: 'KR-H2-1c', kr: 'First-year renewal rate', baseline: '—', target: '55%', due: '2027-12-31' },
    ],
    bets: ['One channel done properly', 'Referral loop through Support Circle'],
    nonBets: ['Paid ads at scale', 'Enterprise sales team'],
  },
  {
    key: 'O-H3-1',
    horizon: 'H3',
    objective: 'Prove the business, not the project',
    keyResults: [
      { key: 'KR-H3-1a', kr: 'Gross margin', baseline: '—', target: '75%', due: '2028-06-30' },
      { key: 'KR-H3-1b', kr: 'Months to break-even on current burn', baseline: '—', target: '≤ 18', due: '2028-06-30' },
      { key: 'KR-H3-1c', kr: 'Second cohort live', baseline: '0', target: '1', due: '2028-06-30' },
    ],
    bets: ['Second cohort chosen on evidence from the research layer'],
    nonBets: ['International localisation', 'Hardware or wearables'],
  },
  {
    key: 'O-H4-1',
    horizon: 'H4',
    objective: 'Own the follow-through category',
    keyResults: [
      { key: 'KR-H4-1a', kr: 'Services using MyRhythm as standard discharge follow-through', baseline: '0', target: '25', due: '2031-12-31' },
      { key: 'KR-H4-1b', kr: 'Peer-reviewed or service-evaluation publications', baseline: '0', target: '3', due: '2031-12-31' },
      { key: 'KR-H4-1c', kr: 'Granted trademarks across UK and US', baseline: '0', target: '6', due: '2031-12-31' },
    ],
    bets: ['Publish the evidence, not just the product'],
    nonBets: ['Becoming a clinical outcome instrument'],
  },
];

/* ------------------------------------------------------------------ */
/* Metrics                                                             */
/* ------------------------------------------------------------------ */

export type MetricBlock = 'Business' | 'Continuity';
export type ClaimDomain = 'Behaviour' | 'Confidence' | 'Identity' | 'Quality of life' | 'Commercial';

export interface MetricDef {
  key: string;
  block: MetricBlock;
  metric: string;
  definition: string;
  domain: ClaimDomain;
  standardRef: string;
}

export const METRICS: MetricDef[] = [
  { key: 'MET-B1', block: 'Business', metric: 'Paying members', definition: 'Active paid subscriptions at the end of the week', domain: 'Commercial', standardRef: 'Internal' },
  { key: 'MET-B2', block: 'Business', metric: 'P0 bugs open', definition: 'Blocking defects unresolved on Friday', domain: 'Commercial', standardRef: 'Internal' },
  { key: 'MET-B3', block: 'Business', metric: 'Clinician conversations', definition: 'Cumulative conversations held with a named clinician', domain: 'Commercial', standardRef: 'Internal' },
  { key: 'MET-C1', block: 'Continuity', metric: 'Follow-through rate', definition: 'Commitments completed ÷ commitments made, per week', domain: 'Behaviour', standardRef: 'Goal attainment — NICE NG211, CARF' },
  { key: 'MET-C2', block: 'Continuity', metric: 'Plan continuation at 30/60/90 days', definition: 'Percentage of discharge-agreed items still live', domain: 'Behaviour', standardRef: 'Discharge follow-through — CQC, CARF' },
  { key: 'MET-C3', block: 'Continuity', metric: 'Capture → commit conversion', definition: 'Captures that became a dated action', domain: 'Behaviour', standardRef: 'Intention becomes plan' },
  { key: 'MET-C4', block: 'Continuity', metric: 'Reschedule-not-abandon rate', definition: 'Missed items moved rather than dropped', domain: 'Behaviour', standardRef: 'Resilience of the plan' },
  { key: 'MET-C5', block: 'Continuity', metric: 'Support Circle involvement', definition: 'Distinct people taking an action in the week', domain: 'Quality of life', standardRef: 'Carer involvement — NICE NG211' },
  { key: 'MET-C6', block: 'Continuity', metric: 'Confidence in own plan', definition: 'Single self-reported check-in, 1–5', domain: 'Confidence', standardRef: 'Person-reported experience — CARF' },
  { key: 'MET-C7', block: 'Continuity', metric: 'Days the plan held together', definition: 'Days with at least one completed commitment', domain: 'Quality of life', standardRef: 'Continuity after discharge' },
];

/**
 * The claim guardrail. Anything outside these domains is refused at source —
 * the sheet has no column for cognition, function or medical events.
 */
export const PERMITTED_DOMAINS: ClaimDomain[] = [
  'Behaviour',
  'Confidence',
  'Identity',
  'Quality of life',
  'Commercial',
];

export const METRICS_STANDARDS_NOTE =
  'No metric here is a mandated clinical measure, and none should be presented as one. Centres already collect FIM+FAM / UKROC and MPAI-4 through their own systems. MyRhythm records what those instruments stop short of: whether the agreed plan continued after discharge.';

/* ------------------------------------------------------------------ */
/* Risks                                                               */
/* ------------------------------------------------------------------ */

export interface Risk {
  key: string;
  risk: string;
  trigger: string;
  response: string;
}

export const RISKS: Risk[] = [
  { key: 'R1', risk: 'Scope creep pushes the launch past Christmas', trigger: 'Any item added to the MVP checklist after week 1', response: 'It goes to H1. No exceptions, written in the sheet.' },
  { key: 'R2', risk: 'Testers sign up but never return', trigger: 'Fewer than 5 of 10 testers complete a second session', response: 'Stop building; run three phone calls and fix the first friction named.' },
  { key: 'R3', risk: 'Clinician conversations stall', trigger: 'No conversation booked by week 12', response: 'Widen from NHS services to independent neuropsychologists and case managers.' },
  { key: 'R4', risk: 'Claim language drifts toward clinical outcomes', trigger: 'Any copy implying improved function or cognition', response: 'Roll back the copy the same day and re-run the claims-policy audit.' },
  { key: 'R5', risk: 'Founder burnout', trigger: 'Two consecutive weeks of weekend work', response: 'Cut the next week to one outcome and protect the weekend.' },
];

/* ------------------------------------------------------------------ */
/* Progress record                                                     */
/* ------------------------------------------------------------------ */

export interface PlaybookProgressRow {
  horizon: string;
  item_key: string;
  status: PlaybookStatus | null;
  value: string | null;
  note: string | null;
  updated_at?: string;
}

/** Every key that can carry progress, with the horizon it belongs to. */
export function allProgressKeys(): Array<{ horizon: string; key: string; label: string }> {
  const rows: Array<{ horizon: string; key: string; label: string }> = [];
  HORIZONS.forEach(h => rows.push({ horizon: h.key, key: h.key, label: h.name }));
  GATES.forEach(g => rows.push({ horizon: g.horizon, key: g.key, label: g.name }));
  PLAN_WEEKS.forEach(w => rows.push({ horizon: 'H0', key: w.key, label: `Week ${w.week} — ${w.theme}` }));
  MVP_CHECKLIST.forEach(c => rows.push({ horizon: 'H0', key: c.key, label: c.item }));
  LEGAL_ITEMS.forEach(l => rows.push({ horizon: 'H0', key: l.key, label: l.action }));
  OBJECTIVES.forEach(o => {
    rows.push({ horizon: o.horizon, key: o.key, label: o.objective });
    o.keyResults.forEach(kr => rows.push({ horizon: o.horizon, key: kr.key, label: kr.kr }));
  });
  METRICS.forEach(m => rows.push({ horizon: 'H0', key: m.key, label: m.metric }));
  RISKS.forEach(r => rows.push({ horizon: 'H0', key: r.key, label: r.risk }));
  return rows;
}

export const PLAYBOOK_KEY_SET = new Set(allProgressKeys().map(r => r.key));
