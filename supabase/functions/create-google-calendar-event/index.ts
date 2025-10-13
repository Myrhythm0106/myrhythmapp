import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { calendar_event_id, action_id } = await req.json();

    if (!calendar_event_id) {
      throw new Error('calendar_event_id is required');
    }

    console.log('Creating Google Calendar event for:', { calendar_event_id, action_id, user_id: user.id });

    // Get event details from Supabase
    const { data: eventData, error: eventError } = await supabaseClient
      .from('calendar_events')
      .select('*')
      .eq('id', calendar_event_id)
      .eq('user_id', user.id)
      .single();

    if (eventError || !eventData) {
      throw new Error('Calendar event not found');
    }

    // Get user profile for persona detection
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('persona_mode')
      .eq('id', user.id)
      .single();

    const personaMode = profile?.persona_mode || 'recovery';

    // Get active Google Calendar integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('calendar_integrations')
      .select('id, provider, token_expires_at')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.error('No active Google Calendar integration found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No active Google Calendar integration found. Please connect your calendar first.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get tokens from Vault using security definer function
    const { data: tokens, error: tokensError } = await supabaseClient
      .rpc('get_calendar_integration_tokens', { p_integration_id: integration.id });

    if (tokensError || !tokens || tokens.length === 0) {
      console.error('Failed to retrieve tokens:', tokensError);
      throw new Error('Failed to retrieve calendar tokens');
    }

    let accessToken = tokens[0].access_token;
    const refreshToken = tokens[0].refresh_token;
    const tokenExpiresAt = new Date(tokens[0].token_expires_at);

    // Check if token needs refresh
    if (tokenExpiresAt < new Date()) {
      console.log('Access token expired, refreshing...');
      
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh access token');
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;
      
      // Update tokens in Vault
      await supabaseClient.rpc('update_calendar_integration_tokens', {
        p_integration_id: integration.id,
        p_access_token: accessToken,
        p_refresh_token: refreshToken,
        p_token_expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
      });
    }

    // Format event based on persona
    let eventTitle = eventData.title;
    let eventDescription = eventData.description || '';

    if (personaMode === 'recovery') {
      eventTitle = eventTitle.replace('🌟 Life Priority:', '💜 Care Step:');
      eventDescription = `🌱 Recovery Action\n\n${eventDescription}\n\n✨ Remember: One step at a time. Progress over perfection.`;
    } else if (personaMode === 'executive') {
      eventTitle = eventTitle.replace('🌟 Life Priority:', '🎯 Commitment:');
      eventDescription = `📊 Accountability Item\n\n${eventDescription}\n\n💼 Track this commitment for performance metrics.`;
    }

    // Parse date and time
    const startDateTime = `${eventData.date}T${eventData.time}:00`;
    const endDateTime = new Date(new Date(startDateTime).getTime() + 30 * 60000).toISOString();

    // Create event in Google Calendar
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: eventTitle,
          description: eventDescription,
          start: {
            dateTime: startDateTime,
            timeZone: 'UTC',
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'UTC',
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 15 },
            ],
          },
        }),
      }
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.text();
      console.error('Google Calendar API error:', errorData);
      throw new Error(`Failed to create Google Calendar event: ${errorData}`);
    }

    const createdEvent = await calendarResponse.json();
    
    console.log('Successfully created Google Calendar event:', createdEvent.id);

    // Store external event ID in Supabase
    await supabaseClient
      .from('external_calendar_events')
      .insert({
        user_id: user.id,
        integration_id: integration.id,
        external_event_id: createdEvent.id,
        title: eventTitle,
        description: eventDescription,
        date: eventData.date,
        time: eventData.time,
        source: 'memory_bridge',
        status: 'confirmed',
      });

    return new Response(
      JSON.stringify({
        success: true,
        external_event_id: createdEvent.id,
        event_link: createdEvent.htmlLink,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-google-calendar-event:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
