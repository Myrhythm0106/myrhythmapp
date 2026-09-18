import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function feedUrlFor(token: string): string {
  const base = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (PROJECT_ID ? `https://${PROJECT_ID}.supabase.co` : '');
  return `${base}/functions/v1/calendar-feed?token=${token}`;
}

/**
 * The private subscribe link. One link, pasted into Google, Outlook or Apple
 * Calendar once — every dated step then appears there and keeps itself current.
 */
export function useCalendarFeed() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) {
      setToken(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('calendar_feed_tokens')
      .select('token')
      .eq('user_id', user.id)
      .is('revoked_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) console.error('Failed to load calendar link:', error);
    setToken(data?.token ?? null);
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Creates the link the first time, or replaces it if asked. */
  const createLink = useCallback(async (): Promise<string | null> => {
    if (!user?.id) return null;
    setIsWorking(true);
    try {
      await supabase
        .from('calendar_feed_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('revoked_at', null);

      const value = newToken();
      const { error } = await supabase
        .from('calendar_feed_tokens')
        .insert({ user_id: user.id, token: value });
      if (error) throw error;
      setToken(value);
      return value;
    } catch (err) {
      console.error('Failed to create calendar link:', err);
      return null;
    } finally {
      setIsWorking(false);
    }
  }, [user?.id]);

  const revokeLink = useCallback(async () => {
    if (!user?.id) return;
    setIsWorking(true);
    try {
      await supabase
        .from('calendar_feed_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('revoked_at', null);
      setToken(null);
    } finally {
      setIsWorking(false);
    }
  }, [user?.id]);

  return {
    token,
    url: token ? feedUrlFor(token) : null,
    isLoading,
    isWorking,
    createLink,
    revokeLink,
    reload: load,
  };
}
