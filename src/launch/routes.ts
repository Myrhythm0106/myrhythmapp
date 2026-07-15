// Single source of truth for all /launch/* routes.
// Consumed by LaunchYouAreHereDial, LaunchStepLocator, and future nav components.
//
// Rings:
//   inner  = Core 5 (Home, Capture, Commit, Calibrate, Celebrate)
//   middle = Key features (Calendar, Memory Bridge, Support Circle, Games, Vision, Goals)
//   outer  = Utilities & deep pages
//
// Groups are used for accessible section labels inside the dial.

import {
  Home, Mic, CheckSquare, Activity, Sparkles,
  Calendar, Brain, Users, Gamepad2, Target, Flag,
  BarChart3, Store, User, Settings, Map, Bell, Microscope, FileText, GitBranch, Info, HelpCircle, LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

export type LaunchRing = 'inner' | 'middle' | 'outer';
export type LaunchGroup =
  | 'core-loop'
  | 'key-features'
  | 'insights'
  | 'account'
  | 'about'
  | 'clinical';

export interface LaunchRoute {
  path: string;
  label: string;
  icon: LucideIcon;
  ring: LaunchRing;
  group: LaunchGroup;
  /** Short one-line description for tooltip / a11y */
  description?: string;
}

export const LAUNCH_ROUTES: readonly LaunchRoute[] = [
  // Inner ring — the Core 5 (4C loop + Home)
  { path: '/launch/home',      label: 'Home',      icon: Home,        ring: 'inner', group: 'core-loop', description: 'Your daily rhythm dashboard' },
  { path: '/launch/capture',   label: 'Capture',   icon: Mic,         ring: 'inner', group: 'core-loop', description: 'Voice-first quick capture' },
  { path: '/launch/commit',    label: 'Commit',    icon: CheckSquare, ring: 'inner', group: 'core-loop', description: 'Energy-matched next steps' },
  { path: '/launch/calibrate', label: 'Calibrate', icon: Activity,    ring: 'inner', group: 'core-loop', description: 'Energy & mood check-in' },
  { path: '/launch/celebrate', label: 'Celebrate', icon: Sparkles,    ring: 'inner', group: 'core-loop', description: 'Wins & gratitude' },

  // Middle ring — key features
  { path: '/launch/calendar',        label: 'Calendar',       icon: Calendar, ring: 'middle', group: 'key-features', description: 'Day view & smart schedule' },
  { path: '/launch/memory',          label: 'Memory Bridge',  icon: Brain,    ring: 'middle', group: 'key-features', description: 'Record → next steps → share' },
  { path: '/launch/support',         label: 'Support Circle', icon: Users,    ring: 'middle', group: 'key-features', description: 'No one walks alone' },
  { path: '/launch/games',           label: 'Brain Games',    icon: Gamepad2, ring: 'middle', group: 'key-features', description: 'Gentle cognitive practice' },
  { path: '/launch/vision-statement',label: 'Vision',         icon: Target,   ring: 'middle', group: 'key-features', description: 'Your north-star statement' },
  { path: '/launch/goals',           label: 'Goals',          icon: Flag,     ring: 'middle', group: 'key-features', description: 'Vision → Goals → Daily' },

  // Outer ring — utilities & deep pages
  { path: '/launch/analytics',        label: 'Analytics',        icon: BarChart3, ring: 'outer', group: 'insights',  description: 'Trends & insights' },
  { path: '/launch/store',            label: 'Store',            icon: Store,     ring: 'outer', group: 'insights',  description: 'Add-on features' },
  { path: '/launch/profile',          label: 'Profile',          icon: User,      ring: 'outer', group: 'account',   description: 'Your profile' },
  { path: '/launch/settings',         label: 'Settings',         icon: Settings,  ring: 'outer', group: 'account',   description: 'App settings' },
  { path: '/launch/roadmap',          label: 'Roadmap',          icon: Map,       ring: 'outer', group: 'about',     description: 'What we\'re building' },
  { path: '/launch/whats-new',        label: "What's New",       icon: Bell,      ring: 'outer', group: 'about',     description: 'Release notes' },
  { path: '/launch/science',          label: 'Science',          icon: Microscope,ring: 'outer', group: 'about',     description: 'Evidence base' },
  { path: '/launch/clinical-brief',   label: 'Clinical Brief',   icon: FileText,  ring: 'outer', group: 'clinical',  description: 'For clinicians' },
  { path: '/launch/discharge-bridge', label: 'Discharge Bridge', icon: GitBranch, ring: 'outer', group: 'clinical',  description: 'Discharge kit' },
  { path: '/launch/continuity',       label: 'Continuity',       icon: GitBranch, ring: 'outer', group: 'clinical',  description: 'Continuity thread' },
  { path: '/launch/settings/edition', label: 'Edition',          icon: Info,      ring: 'outer', group: 'about',     description: 'About this edition' },
  { path: '/launch/help',             label: 'Help',             icon: HelpCircle,ring: 'outer', group: 'account',   description: 'Get help' },
] as const;

export const ROUTES_BY_RING: Record<LaunchRing, LaunchRoute[]> = {
  inner:  LAUNCH_ROUTES.filter(r => r.ring === 'inner'),
  middle: LAUNCH_ROUTES.filter(r => r.ring === 'middle'),
  outer:  LAUNCH_ROUTES.filter(r => r.ring === 'outer'),
};

export function findLaunchRoute(pathname: string): LaunchRoute | undefined {
  // Exact match first, then longest-prefix match for nested routes
  const exact = LAUNCH_ROUTES.find(r => r.path === pathname);
  if (exact) return exact;
  return LAUNCH_ROUTES
    .filter(r => pathname.startsWith(r.path + '/') || pathname.startsWith(r.path))
    .sort((a, b) => b.path.length - a.path.length)[0];
}

/** Ordered 4C loop steps for LaunchStepLocator */
export const CORE_LOOP_STEPS: LaunchRoute[] = LAUNCH_ROUTES.filter(
  r => r.group === 'core-loop'
);
