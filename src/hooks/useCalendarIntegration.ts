import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook';
  account_email: string;
  account_name: string | null;
  is_active: boolean;
  sync_enabled: boolean;
  last_sync: string | null;
}

export function useCalendarIntegration() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchIntegrations = useCallback(async () => {
    if (!user?.id) {
      setIntegrations([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('id, provider, account_email, account_name, is_active, sync_enabled, last_sync')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setIntegrations((data || []) as CalendarIntegration[]);
    } catch (err) {
      console.error('Error fetching calendar integrations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const connectGoogle = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please log in to connect your calendar');
        return;
      }

      const { data, error } = await supabase.functions.invoke('calendar-google-auth/auth', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;
      
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Error connecting Google Calendar:', err);
      toast.error('Failed to connect Google Calendar');
    }
  }, []);

  const connectOutlook = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please log in to connect your calendar');
        return;
      }

      const { data, error } = await supabase.functions.invoke('calendar-outlook-auth/auth', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;
      
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Error connecting Outlook Calendar:', err);
      toast.error('Failed to connect Outlook Calendar');
    }
  }, []);

  const syncCalendar = useCallback(async (integrationId?: string) => {
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please log in to sync your calendar');
        return;
      }

      const targetIntegrations = integrationId 
        ? integrations.filter(i => i.id === integrationId)
        : integrations;

      for (const integration of targetIntegrations) {
        const functionName = integration.provider === 'google' 
          ? 'calendar-google-sync' 
          : 'calendar-outlook-sync';

        const { error } = await supabase.functions.invoke(functionName, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });

        if (error) {
          console.error(`Error syncing ${integration.provider}:`, error);
          toast.error(`Failed to sync ${integration.provider} calendar`);
        }
      }

      await fetchIntegrations();
      toast.success('Calendar synced successfully');
    } catch (err) {
      console.error('Error syncing calendar:', err);
      toast.error('Failed to sync calendar');
    } finally {
      setIsSyncing(false);
    }
  }, [integrations, fetchIntegrations]);

  const pushUpcoming = useCallback(async () => {
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please log in to push events');
        return;
      }
      const { data, error } = await supabase.functions.invoke('calendar-push-upcoming', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      const d = (data ?? {}) as { pushed_google?: number; pushed_outlook?: number; skipped?: number; errors?: string[] };
      const total = (d.pushed_google ?? 0) + (d.pushed_outlook ?? 0);
      if (total === 0 && (d.skipped ?? 0) === 0) {
        toast.info('No upcoming events to push');
      } else {
        toast.success(`Pushed ${total} event${total === 1 ? '' : 's'} (${d.skipped ?? 0} already synced)`);
      }
      if (d.errors && d.errors.length) console.warn('Push errors:', d.errors);
      await fetchIntegrations();
    } catch (err) {
      console.error('Error pushing events:', err);
      toast.error('Failed to push events');
    } finally {
      setIsSyncing(false);
    }
  }, [fetchIntegrations]);

  const disconnectCalendar = useCallback(async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_integrations')
        .update({ is_active: false, sync_enabled: false })
        .eq('id', integrationId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      await fetchIntegrations();
      toast.success('Calendar disconnected');
    } catch (err) {
      console.error('Error disconnecting calendar:', err);
      toast.error('Failed to disconnect calendar');
    }
  }, [user?.id, fetchIntegrations]);

  return {
    integrations,
    isLoading,
    isSyncing,
    connectGoogle,
    connectOutlook,
    syncCalendar,
    pushUpcoming,
    disconnectCalendar,
    refresh: fetchIntegrations,
  };
}
