export type TaskPhase = 'mvp' | 'full-launch';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'milestone';

export interface RoadmapTask {
  id: string;
  title: string;
  phase: TaskPhase;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  status: TaskStatus;
  color: string; // Tailwind class
  dependencies?: string[];
  description?: string;
  subtasks?: string[];
  isMilestone?: boolean;
}

export const TIMELINE_START = new Date('2026-04-01');
export const TIMELINE_END = new Date('2026-12-31');
export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const roadmapTasks: RoadmapTask[] = [
  // MVP Phase
  {
    id: 'auth',
    title: 'Auth & User Onboarding',
    phase: 'mvp',
    startDate: '2026-04-01',
    endDate: '2026-04-18',
    status: 'not-started',
    color: 'from-brand-teal-500 to-brand-teal-600',
    description: 'Supabase auth, user type selection, onboarding flow',
    subtasks: ['Email/password auth', 'Social login (Google)', 'User type selection', 'Onboarding wizard'],
  },
  {
    id: 'leap-core',
    title: 'LEAP Core: Memory Bridge + Scheduling',
    phase: 'mvp',
    startDate: '2026-04-14',
    endDate: '2026-05-16',
    status: 'not-started',
    color: 'from-brand-emerald-500 to-brand-emerald-600',
    dependencies: ['auth'],
    description: 'Voice-to-action Memory Bridge, energy-aware calendar',
    subtasks: ['Voice recording & transcription', 'Action extraction engine', 'Energy-aware scheduling', 'Calendar integration'],
  },
  {
    id: 'subscription-ui',
    title: '3-Tier Subscription UI',
    phase: 'mvp',
    startDate: '2026-05-05',
    endDate: '2026-05-23',
    status: 'not-started',
    color: 'from-brand-blue-500 to-brand-blue-600',
    dependencies: ['auth'],
    description: 'Free, Pro, and Enterprise tier selection with feature gating',
    subtasks: ['Pricing page', 'Feature comparison', 'Tier gating logic'],
  },
  {
    id: 'stripe',
    title: 'Stripe Payment Integration',
    phase: 'mvp',
    startDate: '2026-05-19',
    endDate: '2026-06-06',
    status: 'not-started',
    color: 'from-brand-orange-500 to-brand-orange-600',
    dependencies: ['subscription-ui'],
    description: 'Stripe checkout, subscription management, webhooks',
    subtasks: ['Stripe Checkout integration', 'Subscription lifecycle', 'Webhook handling', 'Invoice management'],
  },
  {
    id: 'beta-qa',
    title: 'Beta Testing & QA',
    phase: 'mvp',
    startDate: '2026-06-02',
    endDate: '2026-06-20',
    status: 'not-started',
    color: 'from-neural-purple-500 to-neural-purple-600',
    dependencies: ['stripe'],
    description: 'Internal testing, bug fixes, performance optimization',
    subtasks: ['Load testing', 'Accessibility audit', 'Mobile responsiveness', 'Security review'],
  },
  {
    id: 'soft-launch',
    title: 'Soft Launch: 50 Founding Members',
    phase: 'mvp',
    startDate: '2026-06-23',
    endDate: '2026-06-30',
    status: 'not-started',
    color: 'from-memory-emerald-500 to-memory-emerald-600',
    dependencies: ['beta-qa'],
    description: 'Invite-only launch to 50 founding members',
    isMilestone: true,
  },
  // Full Launch Phase
  {
    id: 'clinical-pilots',
    title: 'Clinical Partnership Pilots',
    phase: 'full-launch',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    status: 'not-started',
    color: 'from-brand-teal-500 to-clarity-teal-600',
    description: 'Shepherd Center & Craig Hospital pilot programs',
    subtasks: ['Partner onboarding', 'Clinical data integration', 'Outcome tracking', 'Compliance review'],
  },
  {
    id: 'support-circle',
    title: 'Support Circle Features',
    phase: 'full-launch',
    startDate: '2026-07-14',
    endDate: '2026-08-29',
    status: 'not-started',
    color: 'from-brand-emerald-500 to-memory-emerald-600',
    dependencies: ['clinical-pilots'],
    description: 'Caregiver tools, watcher system, accountability',
    subtasks: ['Caregiver dashboard', 'Watcher permissions', 'Accountability reminders', 'Family sharing'],
  },
  {
    id: 'brain-games',
    title: 'Brain Games & Cognitive Tools',
    phase: 'full-launch',
    startDate: '2026-08-04',
    endDate: '2026-09-19',
    status: 'not-started',
    color: 'from-brain-health-500 to-brain-health-600',
    description: 'Cognitive exercises, progress tracking, gamification',
    subtasks: ['Memory exercises', 'Focus training', 'Progress analytics', 'Achievement system'],
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    phase: 'full-launch',
    startDate: '2026-09-01',
    endDate: '2026-10-03',
    status: 'not-started',
    color: 'from-neural-blue-500 to-neural-blue-600',
    dependencies: ['brain-games'],
    description: 'User insights, cognitive trends, engagement metrics',
    subtasks: ['Trend charts', 'Weekly reports', 'Export capabilities'],
  },
  {
    id: 'b2b-enterprise',
    title: 'B2B Enterprise Features',
    phase: 'full-launch',
    startDate: '2026-10-01',
    endDate: '2026-11-14',
    status: 'not-started',
    color: 'from-neural-purple-500 to-neural-purple-600',
    description: 'Multi-seat licensing, admin panel, SSO',
    subtasks: ['Admin console', 'Team management', 'SSO integration', 'Usage reporting'],
  },
  {
    id: 'marketing-growth',
    title: 'Marketing & Growth Push',
    phase: 'full-launch',
    startDate: '2026-11-01',
    endDate: '2026-12-12',
    status: 'not-started',
    color: 'from-brand-orange-500 to-brand-orange-600',
    dependencies: ['b2b-enterprise'],
    description: 'Content marketing, partnerships, paid acquisition',
    subtasks: ['Content calendar', 'Partnership outreach', 'Paid campaigns', 'Referral program'],
  },
  {
    id: 'arr-target',
    title: '£500K ARR Target',
    phase: 'full-launch',
    startDate: '2026-12-31',
    endDate: '2026-12-31',
    status: 'not-started',
    color: 'from-memory-emerald-500 to-memory-emerald-600',
    isMilestone: true,
    description: '1,000+ active subscribers at £500K annual run rate',
  },
];

export const milestones = [
  { date: '2026-04-01', label: 'Development Kickoff', icon: '🚀', phase: 'mvp' as TaskPhase },
  { date: '2026-06-30', label: 'MVP Soft Launch', icon: '🎯', phase: 'mvp' as TaskPhase },
  { date: '2026-07-01', label: 'Clinical Pilots Begin', icon: '🏥', phase: 'full-launch' as TaskPhase },
  { date: '2026-09-01', label: 'Analytics Live', icon: '📊', phase: 'full-launch' as TaskPhase },
  { date: '2026-12-31', label: '£500K ARR Target', icon: '💰', phase: 'full-launch' as TaskPhase },
];
