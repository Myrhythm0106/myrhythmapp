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
 *   register → user-type → assessment → welcome → payment → home
 *
 * Mount once inside LaunchLayout — no per-page wiring needed.
 */
const ONBOARDING_STEPS: StepLocatorItem[] = [
  { label: 'Register',   path: '/launch/register' },
  { label: 'You',        path: '/launch/user-type' },
  { label: 'Assessment', path: '/launch/assessment' },
  { label: 'Results',    path: '/launch/welcome' },
  { label: 'Membership', path: '/launch/payment' },
  { label: 'Home',       path: '/launch/home' },
];

/**
 * One-line "what you're doing now, and what's next" per step, so the user
 * never feels lost. Keyed by path.
 */
const STEP_DESCRIPTIONS: Record<string, string> = {
  '/launch/register':
    "Create your account — your information stays private and only you can see it. Next: a little about you.",
  '/launch/user-type':
    "Tell me who's using MyRhythm so everything feels made for you. Next: eight quick questions.",
  '/launch/assessment':
    "Eight questions about your days — it's how I learn when you're at your best. Next: your personal report.",
  '/launch/welcome':
    'Your MYRHYTHM report — read it, keep it, come back to it any time. Next: choose your membership.',
  '/launch/payment':
    "Choose how you'd like to join. Next: your new Home.",
};

export function OnboardingProgressBar() {
  const { pathname } = useLocation();
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
