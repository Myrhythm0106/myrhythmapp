import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  pageUrl?: string;
}

export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = async ({ eventType, eventData = {}, pageUrl }: AnalyticsEvent) => {
    try {
      await supabase.from('analytics_events').insert({
        user_id: user?.id || null,
        event_type: eventType,
        event_data: eventData,
        page_url: pageUrl || window.location.pathname,
        user_agent: navigator.userAgent,
        session_id: sessionStorage.getItem('session_id') || 'anonymous'
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  // Track page views automatically
  useEffect(() => {
    const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}`;
    sessionStorage.setItem('session_id', sessionId);

    trackEvent({
      eventType: 'page_view',
      eventData: { 
        timestamp: new Date().toISOString(),
        referrer: document.referrer 
      }
    });
  }, []);

  return { trackEvent };
}