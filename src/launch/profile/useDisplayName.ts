import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Returns the user's preferred first name for greetings.
 * Resolution order: profiles.name -> user_metadata.name/full_name -> email local-part -> fallback.
 * Always returns a non-empty string; safe to render directly.
 */
export function useDisplayName(fallback: string = 'friend'): string {
  const { user } = useAuth();
  const [name, setName] = useState<string>(fallback);

  useEffect(() => {
    let cancelled = false;

    function firstWord(s: string | null | undefined): string | null {
      if (!s) return null;
      const trimmed = s.trim();
      if (!trimmed) return null;
      return trimmed.split(/\s+/)[0];
    }

    async function resolve() {
      if (!user) {
        if (!cancelled) setName(fallback);
        return;
      }

      // 1. profiles.name
      try {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .maybeSingle();
        const fromProfile = firstWord((data as { name?: string } | null)?.name ?? null);
        if (fromProfile && !cancelled) {
          setName(fromProfile);
          return;
        }
      } catch {
        // fall through
      }

      // 2. user metadata
      const meta = (user as { user_metadata?: Record<string, unknown> }).user_metadata ?? {};
      const fromMeta =
        firstWord((meta.name as string | undefined) ?? null) ||
        firstWord((meta.full_name as string | undefined) ?? null) ||
        firstWord((meta.first_name as string | undefined) ?? null);
      if (fromMeta && !cancelled) {
        setName(fromMeta);
        return;
      }

      // 3. email local-part
      const email = (user as { email?: string }).email;
      const fromEmail = email ? firstWord(email.split('@')[0].replace(/[._-]+/g, ' ')) : null;
      if (fromEmail && !cancelled) {
        setName(fromEmail.charAt(0).toUpperCase() + fromEmail.slice(1));
        return;
      }

      if (!cancelled) setName(fallback);
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [user, fallback]);

  return name;
}
