import { supabase } from '@/integrations/supabase/client';

/**
 * Ask Supabase for the *real* session rather than trusting a React state
 * value that can go stale on a tab that has been open or backgrounded for
 * hours. If the access token has expired we try a silent refresh from the
 * stored refresh token before giving up.
 *
 * Returns the authenticated user id, or null when the session is genuinely
 * gone and the person needs to sign in again.
 */
export async function ensureSession(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) console.warn('ensureSession: getSession failed', error);

    const session = data?.session ?? null;
    if (session?.user) {
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      // Refresh when the token is expired or within 60s of expiring.
      if (!expiresAt || expiresAt - Date.now() > 60_000) {
        return session.user.id;
      }
    }

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.warn('ensureSession: refreshSession failed', refreshError);
      return null;
    }
    return refreshed?.session?.user?.id ?? null;
  } catch (err) {
    console.warn('ensureSession: unexpected error', err);
    return null;
  }
}

/** Best-effort keep-alive — safe to call on visibility change or a timer. */
export async function touchSession(): Promise<void> {
  await ensureSession();
}
