// Single source of truth for the Investor Data Room.
// Consumed by /founder/data-room and mirrored in
// /mnt/documents/launch_v2_3/founder_pack/Investor_Data_Room.md
//
// Keep this file and the markdown index in sync — the markdown is the
// offline/Drive copy, this is the in-app copy.

export type ArtefactStatus = 'final' | 'draft' | 'human-action';

export interface Artefact {
  id: string;
  title: string;
  /** The investor question this artefact answers */
  answers: string;
  format: 'Markdown' | 'Excel' | 'PNG' | 'In-app';
  /** Location under /mnt/documents, or an in-app route */
  location: string;
  status: ArtefactStatus;
  updated: string;
}

export interface DataRoomSection {
  id: string;
  title: string;
  blurb: string;
  artefacts: Artefact[];
}

const PACK = 'launch_v2_3/founder_pack/myrhythm/';
const ROOT = 'launch_v2_3/';

export const DATA_ROOM_SECTIONS: DataRoomSection[] = [
  {
    id: 'narrative',
    title: 'Pitch narrative',
    blurb: 'Start here. What we are, who it is for, and why now.',
    artefacts: [
      {
        id: 'F1-N',
        title: 'Investor Narrative Memo',
        answers: 'What is the company and why is it investable?',
        format: 'Markdown',
        location: `${PACK}MyRhythm_F1_Investor_Narrative.md`,
        status: 'final',
        updated: '29 Jul 2026',
      },
      {
        id: 'PF2',
        title: 'Problem-Fit & Market v2',
        answers: 'What problem, how big, and who benefits beyond brain injury?',
        format: 'Markdown',
        location: `${ROOT}../MyRhythm_Problem-Fit_and_Market_v2.md`,
        status: 'final',
        updated: '28 Jul 2026',
      },
      {
        id: 'WEDGE',
        title: 'Market Wedge Infographic v2',
        answers: 'One image that explains the category we are creating.',
        format: 'PNG',
        location: 'MyRhythm_Market_Wedge_Infographic_v2.png',
        status: 'final',
        updated: '28 Jul 2026',
      },
    ],
  },
  {
    id: 'financials',
    title: 'Financial model',
    blurb: 'Unit economics, cost base, funding requirement and runway.',
    artefacts: [
      {
        id: 'F1',
        title: 'Investor Financials (9 tabs)',
        answers: 'Revenue build, cost base, break-even, funding ask.',
        format: 'Excel',
        location: `${PACK}MyRhythm_F1_Investor_Financials_v1.xlsx`,
        status: 'human-action',
        updated: '29 Jul 2026',
      },
      {
        id: 'D7',
        title: 'One-Page Financial Summary',
        answers: 'The numbers on a single page for a first call.',
        format: 'Markdown',
        location: `${ROOT}myrhythm/D7_One_Page_Financial_Summary.md`,
        status: 'final',
        updated: '27 Jul 2026',
      },
      {
        id: 'FIN-APP',
        title: 'Live Financial Dashboard',
        answers: 'Interactive model you can walk an investor through on a call.',
        format: 'In-app',
        location: '/founder/financials',
        status: 'final',
        updated: 'Live',
      },
    ],
  },
  {
    id: 'ninety',
    title: '90-day execution',
    blurb: 'What happens between now and the public paid launch.',
    artefacts: [
      {
        id: 'M1',
        title: 'MVP 90-Day Plan',
        answers: 'What is in the MVP, what success looks like at day 90.',
        format: 'Markdown',
        location: `${PACK}MyRhythm_M1_MVP_90_Day_Plan.md`,
        status: 'final',
        updated: '30 Jul 2026',
      },
      {
        id: 'M2',
        title: '90-Day Action Register',
        answers: 'Every action, owner, date and status. Plus the IP register.',
        format: 'Excel',
        location: `${PACK}MyRhythm_M2_MVP_90_Day_Action_Plan.xlsx`,
        status: 'human-action',
        updated: '30 Jul 2026',
      },
      {
        id: 'MKT',
        title: 'Founders Market Marketing Plan',
        answers: 'How we get to 100 Founding Members.',
        format: 'Markdown',
        location: 'docs/founders-market-marketing-plan.md',
        status: 'final',
        updated: '28 Jul 2026',
      },
    ],
  },
  {
    id: 'fiveyear',
    title: 'Five-year plan',
    blurb: 'The arc from founding cohort to platform.',
    artefacts: [
      {
        id: 'G1',
        title: 'Five-Year Growth Plan',
        answers: 'Phases, channels, headcount, budget by year.',
        format: 'Excel',
        location: `${PACK}MyRhythm_G1_Five_Year_Growth_Plan_v1.xlsx`,
        status: 'final',
        updated: '29 Jul 2026',
      },
      {
        id: 'G1-N',
        title: 'Growth Narrative',
        answers: 'The strategic story behind the five phases.',
        format: 'Markdown',
        location: `${PACK}MyRhythm_G1_Growth_Narrative.md`,
        status: 'final',
        updated: '29 Jul 2026',
      },
      {
        id: 'M3',
        title: 'Five-Year Action Register',
        answers: 'Quarterly actions Y1–Y5, phase gates, IP roadmap.',
        format: 'Excel',
        location: `${PACK}MyRhythm_M3_Five_Year_Action_Plan.xlsx`,
        status: 'final',
        updated: '30 Jul 2026',
      },
    ],
  },
  {
    id: 'competitors',
    title: 'Competitor benchmarking',
    blurb: 'Who else is in the space, what we learned, and why we differ.',
    artefacts: [
      {
        id: 'B1',
        title: 'Competitor Benchmarking Narrative',
        answers: 'Comparables worldwide, lessons learned, why our GTM differs.',
        format: 'Markdown',
        location: `${PACK}MyRhythm_B1_Competitor_Benchmarking.md`,
        status: 'final',
        updated: '30 Jul 2026',
      },
      {
        id: 'B1-X',
        title: 'Competitor Matrix & Scorecard',
        answers: '18 comparables scored across 8 dimensions; where the white space is.',
        format: 'Excel',
        location: `${PACK}MyRhythm_B1_Competitor_Matrix.xlsx`,
        status: 'final',
        updated: '30 Jul 2026',
      },
    ],
  },
  {
    id: 'ip',
    title: 'IP & legal',
    blurb: 'What is protected, what is pending, what needs counsel.',
    artefacts: [
      {
        id: 'IP-REG',
        title: 'IP Register (M2 tab)',
        answers: 'Trademarks, copyright, provisional patent decision, trade secrets.',
        format: 'Excel',
        location: `${PACK}MyRhythm_M2_MVP_90_Day_Action_Plan.xlsx → IP_Register`,
        status: 'human-action',
        updated: '30 Jul 2026',
      },
      {
        id: 'IP-ROAD',
        title: 'IP Roadmap (M3 tab)',
        answers: '™ → ® path, Madrid extensions, renewals, enforcement.',
        format: 'Excel',
        location: `${PACK}MyRhythm_M3_Five_Year_Action_Plan.xlsx → IP_Roadmap`,
        status: 'human-action',
        updated: '30 Jul 2026',
      },
    ],
  },
  {
    id: 'product',
    title: 'Product evidence',
    blurb: 'Proof the thing exists and works, not just slides.',
    artefacts: [
      {
        id: 'FVR',
        title: 'Feature Value Ranking',
        answers: 'Every feature ranked against problem fit and competitors.',
        format: 'Markdown',
        location: 'docs/feature-value-ranking.md',
        status: 'final',
        updated: '29 Jul 2026',
      },
      {
        id: 'MKT-EV',
        title: 'Market Evidence',
        answers: 'Cited evidence base behind every claim we make.',
        format: 'Markdown',
        location: 'docs/market-evidence.md',
        status: 'final',
        updated: '26 Jul 2026',
      },
      {
        id: 'ROADMAP',
        title: 'Product Roadmap',
        answers: 'What ships when, in the product itself.',
        format: 'In-app',
        location: '/launch/roadmap',
        status: 'final',
        updated: 'Live',
      },
      {
        id: 'CLIN',
        title: 'Clinical Brief',
        answers: 'The one-pager a clinician reads before referring.',
        format: 'In-app',
        location: '/launch/clinical-brief',
        status: 'final',
        updated: 'Live',
      },
    ],
  },
];

export type Confidence = 'High' | 'Medium' | 'Low';

export interface Assumption {
  key: string;
  value: string;
  source: string;
  confidence: Confidence;
}

export const KEY_ASSUMPTIONS: Assumption[] = [
  { key: 'Anchor date (Day 1)', value: '3 Aug 2026', source: 'Founder availability — to be confirmed', confidence: 'Medium' },
  { key: 'Public paid launch', value: '31 Oct 2026 (Day 90)', source: 'M1 90-day plan', confidence: 'Medium' },
  { key: 'Founding cohort target', value: '100 Founding Members', source: 'Founders market marketing plan', confidence: 'Medium' },
  { key: 'Consumer price point', value: '£10 / month equivalent', source: 'F1 revenue build; benchmarked to Calm/Headspace tier', confidence: 'High' },
  { key: 'B2B partner price', value: '£249 / month per partner', source: 'F1 revenue build', confidence: 'Low' },
  { key: 'Provider listing price', value: '£99 / month per listing', source: 'F1 revenue build; directory not live in v0.1', confidence: 'Low' },
  { key: 'Monthly churn', value: '5%', source: 'Consumer wellbeing app category norm', confidence: 'Medium' },
  { key: 'Trial conversion', value: 'Card-on-file trial, conversion assumed above no-card norms', source: 'Competitor practice (Calm, Headspace)', confidence: 'Medium' },
  { key: 'Pre-seed round', value: '£250K at £1.67M', source: 'F1 funding tab — indicative, not committed', confidence: 'Low' },
  { key: 'Founder investment required', value: '$30K–$55K', source: 'Launch plan v2.1 financial model', confidence: 'Medium' },
  { key: 'IP spend, first 90 days', value: '~$17K', source: 'M2 IP_Register cost column', confidence: 'Medium' },
  { key: 'IP spend, 5 years', value: '~$49K', source: 'M3 IP_Roadmap', confidence: 'Low' },
  { key: 'Clinical LOIs by day 90', value: '2 signed letters of intent', source: 'M1 definition of success', confidence: 'Low' },
  { key: 'US entity', value: 'Delaware C-Corp, founder on O-3 status', source: 'Launch plan — pending US counsel', confidence: 'Low' },
];

export interface Comparable {
  name: string;
  cluster: string;
  lesson: string;
}

/** Abridged view — full 18-brand set lives in the B1 matrix */
export const TOP_COMPARABLES: Comparable[] = [
  { name: 'Calm', cluster: 'Consumer scale', lesson: 'Brand and calm-craft beat feature count. Won distribution before depth.' },
  { name: 'Headspace', cluster: 'Consumer → payer', lesson: 'Enterprise/payer pivot bought durability but slowed product focus.' },
  { name: 'Lumosity', cluster: 'Brain training', lesson: 'Anti-pattern. FTC action over unproven cognitive-improvement claims.' },
  { name: 'Constant Therapy', cluster: 'Clinical', lesson: 'Clinician-led rehab works but stops at the exercise, not the day.' },
  { name: 'Tiimo', cluster: 'Executive function', lesson: 'Neurodivergent-native design earns fierce loyalty in a small niche.' },
  { name: 'Motion / Sunsama', cluster: 'Planning', lesson: 'AI planning sells to high performers; assumes an ideal brain.' },
];

export const GTM_DIFFERENCES: string[] = [
  'We start pre-discharge on the ward, not after the person is already lost at home.',
  'We are a Collaborative Cognitive Continuity layer running the 4C loop — not a training game, not another to-do list.',
  'The Support Circle is a first-class surface. No one walks alone.',
  'Universal by design: the same product serves ADHD, stress, ageing and post-event recovery without a "senior mode".',
];

export const KNOWN_GAPS: string[] = [
  'No clinical trial or peer-reviewed evidence of our own yet — we cite others.',
  'No brand awareness. Zero paid acquisition history.',
  'Single-founder capacity is the binding constraint on everything below.',
  'US entity not yet formed; O-3 status implications need US counsel.',
  'Financial model has not been reviewed by a CPA.',
  'No trademark clearance search completed; nothing filed.',
];

export const READING_ORDER: string[] = [
  'Investor Narrative Memo — the story in two pages',
  'Problem-Fit & Market v2 — the size and shape of the need',
  'One-Page Financial Summary, then F1 for depth',
  'MVP 90-Day Plan — what happens next',
  'Five-Year Growth Plan — where this goes',
  'Competitor Benchmarking — why we are not any of them',
];

export const ALL_ARTEFACTS: Artefact[] = DATA_ROOM_SECTIONS.flatMap((s) => s.artefacts);

export const CONFIDENTIALITY_NOTE =
  'Confidential – Not for Distribution | © 2026 Annabel Aaron. All rights reserved.';
