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

export function OnboardingProgressBar() {
  const { pathname } = useLocation();
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.path === pathname);
  if (currentIndex === -1) return null;

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brain-health-100">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <LaunchStepLocator
          steps={ONBOARDING_STEPS}
          currentIndex={currentIndex}
          ariaLabel="Onboarding progress"
        />
      </div>
    </div>
  );
}

export default OnboardingProgressBar;
