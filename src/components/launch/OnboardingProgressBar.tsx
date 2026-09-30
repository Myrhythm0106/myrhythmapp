import React from 'react';
import { useLocation } from 'react-router-dom';
import { LaunchStepLocator, type StepLocatorItem } from './LaunchStepLocator';

/**
 * Onboarding step-locator bar.
 *
 * Auto-detects whether the current route is one of the onboarding steps
 * and, if so, renders the shared LaunchStepLocator so the user always
 * knows where they are in the sequence:
 *
 *   account → about me → questions → snapshot → home
 *
 * Mount once inside LaunchLayout — no per-page wiring needed.
 */
const ONBOARDING_STEPS: StepLocatorItem[] = [
  { label: 'Account',     path: '/launch/register' },
  { label: 'About me',    path: '/launch/user-type' },
  { label: 'Questions',   path: '/launch/assessment' },
  { label: 'My snapshot', path: '/launch/welcome' },
  { label: 'Home',       path: '/launch/home' },
];

/**
 * One-line "what you're doing now, and what's next" per step, so the user
 * never feels lost. Keyed by path.
 */
const STEP_DESCRIPTIONS: Record<string, string> = {
  '/launch/register':
    'Create my account. Next: a little about me, then questions that shape my diary.',
  '/launch/user-type':
    'Choose what best describes me. Next: short questions that shape my diary and reminders.',
  '/launch/assessment':
    'My answers shape my diary, reminders and breaks. Next: my free snapshot.',
  '/launch/welcome':
    'My MYRHYTHM snapshot — I can keep it, choose one action, and continue to Home.',
};

// Screens where the strip is mounted inside LaunchLayout's fixed-height
// column instead (the global copy here would add height and cause a
// second scrollbar on those full-screen pages).
const LAYOUT_MOUNTED_PATHS = new Set([
  '/launch/register',
  '/launch/user-type',
  '/launch/payment',
]);

export function OnboardingProgressBar({ mount = 'global' }: { mount?: 'global' | 'layout' }) {
  const { pathname } = useLocation();
  if (mount === 'global' && LAYOUT_MOUNTED_PATHS.has(pathname)) return null;
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.path === pathname);
  if (currentIndex === -1) return null;
  const description = STEP_DESCRIPTIONS[pathname];

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brain-health-100">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <LaunchStepLocator
          steps={ONBOARDING_STEPS}
          currentIndex={currentIndex}
          ariaLabel="Onboarding progress"
        />
        {description && (
          <p className="text-xs sm:text-sm text-brain-health-700/80 text-center mt-1 pb-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default OnboardingProgressBar;
