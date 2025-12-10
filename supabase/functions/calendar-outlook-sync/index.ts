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
    const OUTLOOK_CLIENT_ID = Deno.env.get('OUTLOOK_CLIENT_ID');
    const OUTLOOK_CLIENT_SECRET = Deno.env.get('OUTLOOK_CLIENT_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OUTLOOK_CLIENT_ID || !OUTLOOK_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: 'Outlook credentials not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get the user's Outlook integration
    const { data: integration, error: integrationError } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'outlook')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      throw new Error('No Outlook integration found');
    }

    // Get tokens from vault
    const { data: tokens, error: tokenError } = await supabase.rpc('get_calendar_integration_tokens', {
      p_integration_id: integration.id
    });

    if (tokenError || !tokens || tokens.length === 0) {
      throw new Error('Failed to retrieve tokens');
    }

    const tokenData = tokens[0];
    let accessToken = tokenData.access_token;

    // Check if token is expired and refresh if needed
    if (tokenData.token_expires_at && new Date(tokenData.token_expires_at) < new Date()) {
      console.log('Token expired, refreshing...');
      
      const refreshResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: OUTLOOK_CLIENT_ID,
          client_secret: OUTLOOK_CLIENT_SECRET,
          refresh_token: tokenData.refresh_token,
          grant_type: 'refresh_token'
        })
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const newTokens = await refreshResponse.json();
      accessToken = newTokens.access_token;

      // Update tokens in vault
      await supabase.rpc('update_calendar_integration_tokens', {
        p_integration_id: integration.id,
        p_access_token: newTokens.access_token,
        p_refresh_token: newTokens.refresh_token || tokenData.refresh_token,
        p_token_expires_at: new Date(Date.now() + (newTokens.expires_in * 1000)).toISOString()
      });
    }

    // Fetch events from Outlook Calendar (next 30 days)
    const startDateTime = new Date().toISOString();
    const endDateTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const eventsResponse = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startDateTime}&enddatetime=${endDateTime}&$top=100&$orderby=start/dateTime`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!eventsResponse.ok) {
      const error = await eventsResponse.text();
      console.error('Failed to fetch events:', error);
      throw new Error('Failed to fetch calendar events');
    }

    const eventsData = await eventsResponse.json();
    const events = eventsData.value || [];

    console.log(`Found ${events.length} events from Outlook`);

    // Upsert events to database
    for (const event of events) {
      const startDate = new Date(event.start.dateTime + 'Z');
      const endDate = new Date(event.end.dateTime + 'Z');
      
      const eventData = {
        user_id: user.id,
        integration_id: integration.id,
        external_event_id: event.id,
        source: 'outlook',
        title: event.subject || 'Untitled Event',
        description: event.bodyPreview || null,
        date: startDate.toISOString().split('T')[0],
        time: event.isAllDay ? null : startDate.toTimeString().slice(0, 5),
        end_time: event.isAllDay ? null : endDate.toTimeString().slice(0, 5),
        is_all_day: event.isAllDay || false,
        location: event.location?.displayName || null,
        status: event.isCancelled ? 'cancelled' : 'confirmed',
        last_synced: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('external_calendar_events')
        .upsert(eventData, {
          onConflict: 'external_event_id,source'
        });

      if (upsertError) {
        console.error('Error upserting event:', upsertError);
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
        synced: events.length,
        message: `Synced ${events.length} events from Outlook` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Outlook Sync Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
