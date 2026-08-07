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
