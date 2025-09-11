// Utilities to standardize onboarding completion across the app

const KEY_COMPLETE = 'myrhythm_onboarding_complete';
const KEY_COMPLETED = 'myrhythm_onboarding_completed';

export function isOnboardingCompleted(): boolean {
  try {
    const v1 = localStorage.getItem(KEY_COMPLETE) === 'true';
    const v2 = localStorage.getItem(KEY_COMPLETED) === 'true';
    return v1 || v2;
  } catch {
    return false;
  }
}

export function markOnboardingCompleted(): void {
  try {
    localStorage.setItem(KEY_COMPLETE, 'true');
    localStorage.setItem(KEY_COMPLETED, 'true');
  } catch {}
}

export function clearOnboardingCompletion(): void {
  try {
    localStorage.removeItem(KEY_COMPLETE);
    localStorage.removeItem(KEY_COMPLETED);
  } catch {}
}
