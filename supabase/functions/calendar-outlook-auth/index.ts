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
    const url = new URL(req.url);
    const pathname = url.pathname;

    const OUTLOOK_CLIENT_ID = Deno.env.get('OUTLOOK_CLIENT_ID');
    const OUTLOOK_CLIENT_SECRET = Deno.env.get('OUTLOOK_CLIENT_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OUTLOOK_CLIENT_ID || !OUTLOOK_CLIENT_SECRET) {
      console.log('Outlook OAuth credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Outlook integration not configured. Please add OUTLOOK_CLIENT_ID and OUTLOOK_CLIENT_SECRET secrets.' 
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Route: /auth - Initiate OAuth flow
    if (pathname.includes('/auth')) {
      const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
      authUrl.searchParams.set('client_id', OUTLOOK_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${SUPABASE_URL}/functions/v1/calendar-outlook-auth/callback`);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid profile email Calendars.Read Calendars.ReadWrite offline_access');
      authUrl.searchParams.set('response_mode', 'query');

      // Store user ID in state for callback
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          authUrl.searchParams.set('state', user.id);
        }
      }

      return new Response(
        JSON.stringify({ authUrl: authUrl.toString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route: /callback - Handle OAuth callback
    if (pathname.includes('/callback')) {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state'); // user_id
      
      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for tokens
      const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: OUTLOOK_CLIENT_ID,
          client_secret: OUTLOOK_CLIENT_SECRET,
          redirect_uri: `${SUPABASE_URL}/functions/v1/calendar-outlook-auth/callback`,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        throw new Error('Failed to exchange authorization code');
      }

      const tokens = await tokenResponse.json();

      // Get user's email from Microsoft Graph
      const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      const userInfo = await userInfoResponse.json();

      // Save to calendar_integrations table
      const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));
      
      const { data: integration, error: dbError } = await supabase
        .from('calendar_integrations')
        .upsert({
          user_id: state,
          provider: 'outlook',
          account_email: userInfo.mail || userInfo.userPrincipalName,
          account_name: userInfo.displayName,
          is_active: true,
          sync_enabled: true,
          last_sync: new Date().toISOString()
        }, {
          onConflict: 'user_id,provider,account_email'
        })
        .select('id')
        .single();

      if (dbError || !integration) {
        console.error('Database error:', dbError);
        throw new Error('Failed to create calendar integration');
      }

      // Update tokens securely
      await supabase.rpc('update_calendar_integration_tokens', {
        p_integration_id: integration.id,
        p_access_token: tokens.access_token,
        p_refresh_token: tokens.refresh_token,
        p_token_expires_at: expiresAt.toISOString()
      });

      // Redirect back to the app
      const appUrl = SUPABASE_URL?.includes('supabase.co') 
        ? 'https://lovable.dev/calendar?connected=outlook'
        : `${SUPABASE_URL}/calendar?connected=outlook`;

      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': appUrl
        }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid route' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Outlook Auth Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
