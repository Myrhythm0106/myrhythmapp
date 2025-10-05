import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's Google calendar integration
    const { data: integration, error: integrationError } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      throw new Error('Google Calendar not connected');
    }

    // Check if token needs refresh
    let accessToken = integration.access_token;
    const tokenExpiresAt = new Date(integration.token_expires_at);
    
    if (tokenExpiresAt <= new Date()) {
      console.log('Token expired, refreshing...');
      
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          refresh_token: integration.refresh_token,
          grant_type: 'refresh_token'
        })
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;
      
      const newExpiresAt = new Date(Date.now() + (refreshData.expires_in * 1000));
      
      await supabase
        .from('calendar_integrations')
        .update({
          access_token: accessToken,
          token_expires_at: newExpiresAt.toISOString()
        })
        .eq('id', integration.id);
    }

    // Fetch events from Google Calendar (next 30 days)
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error('Google Calendar API error:', errorText);
      throw new Error('Failed to fetch calendar events');
    }

    const calendarData = await calendarResponse.json();
    const events = calendarData.items || [];

    console.log(`Fetched ${events.length} events from Google Calendar`);

    // Sync events to database
    const syncedEvents = [];
    
    for (const event of events) {
      const startDateTime = event.start.dateTime || event.start.date;
      const endDateTime = event.end.dateTime || event.end.date;
      const isAllDay = !event.start.dateTime;

      const eventDate = new Date(startDateTime);
      const eventData = {
        user_id: user.id,
        integration_id: integration.id,
        external_event_id: event.id,
        title: event.summary || 'Untitled Event',
        description: event.description || null,
        date: eventDate.toISOString().split('T')[0],
        time: isAllDay ? null : eventDate.toTimeString().slice(0, 5),
        end_time: isAllDay ? null : new Date(endDateTime).toTimeString().slice(0, 5),
        is_all_day: isAllDay,
        location: event.location || null,
        source: 'google',
        status: event.status || 'confirmed',
        timezone: event.start.timeZone || 'UTC',
        last_synced: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('external_calendar_events')
        .upsert(eventData, {
          onConflict: 'external_event_id,source'
        });

      if (upsertError) {
        console.error('Failed to sync event:', event.id, upsertError);
      } else {
        syncedEvents.push(eventData);
      }
    }

    // Update last sync time
    await supabase
      .from('calendar_integrations')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', integration.id);

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncedEvents.length,
        total: events.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
