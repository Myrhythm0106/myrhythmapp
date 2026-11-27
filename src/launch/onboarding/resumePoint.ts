/**
 * Remembers the last onboarding step the user was on so reopening the app
 * returns them to that step instead of the landing page.
 */
const KEY = 'myrhythm_resume_point';

export function setResumePoint(path: string) {
  try {
    localStorage.setItem(KEY, path);
  } catch {
    /* noop */
  }
}

export function getResumePoint(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearResumePoint() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export interface ResumeStep {
  path: string;
  title: string;
  description: string;
  button: string;
}

/** Plain-language destinations for the Home resume card. */
export function resumeStepFor(path: string | null | undefined): ResumeStep | null {
  if (!path) return null;
  if (path.startsWith('/launch/assessment')) {
    return {
      path,
      title: 'My questions and snapshot',
      description: 'Your answers are saved on this device. Carry on, or leave them again at any point.',
      button: 'Continue my questions',
    };
  }
  if (path === '/launch/user-type') {
    return {
      path,
      title: 'About me',
      description: 'Choose what brings you to MyRhythm. It tailors your examples, and every part stays open to you.',
      button: 'Continue about me',
    };
  }
  if (path === '/launch/payment') {
    return {
      path,
      title: 'My starting choice',
      description: 'Return to the card step, then carry on with the same set-up. My earlier choices are still here.',
      button: 'Return to my card step',
    };
  }
  return null;
}

export function getResumeStep(): ResumeStep | null {
  return resumeStepFor(getResumePoint());
}
