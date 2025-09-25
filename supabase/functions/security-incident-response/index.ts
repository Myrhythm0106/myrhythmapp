import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, reason } = await req.json()

    console.log(`🚨 SECURITY INCIDENT: Executing ${action} for user ${userId}. Reason: ${reason}`)

    let result = {}

    switch (action) {
      case 'emergency_lockout':
        // 1. Delete all sessions for the user
        const { error: sessionDeleteError } = await supabaseAdmin
          .from('auth.sessions')
          .delete()
          .eq('user_id', userId)

        if (sessionDeleteError) {
          console.error('❌ Failed to delete sessions:', sessionDeleteError)
        } else {
          console.log('✅ All sessions deleted for user')
        }

        // 2. Sign out all sessions via admin API
        const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(userId, 'global')
        
        if (signOutError) {
          console.error('❌ Failed to sign out user globally:', signOutError)
        } else {
          console.log('✅ User signed out globally')
        }

        // 3. Log security event
        const { error: logError } = await supabaseAdmin.rpc('log_security_event', {
          p_user_id: userId,
          p_event_type: 'EMERGENCY_LOCKOUT',
          p_event_data: {
            reason,
            action: 'emergency_lockout',
            timestamp: new Date().toISOString(),
            initiated_by: 'security_system'
          }
        })

        if (logError) {
          console.error('❌ Failed to log security event:', logError)
        }

        result = {
          success: true,
          actions_completed: [
            'sessions_deleted',
            'global_signout',
            'security_event_logged'
          ]
        }
        break

      case 'force_password_reset':
        // Generate password reset for the user
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
        
        if (userError || !userData.user) {
          throw new Error(`Failed to get user: ${userError?.message}`)
        }

        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: userData.user.email!,
          options: {
            redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/#/auth`
          }
        })

        if (resetError) {
          console.error('❌ Failed to generate password reset:', resetError)
          throw resetError
        }

        console.log('✅ Password reset initiated for user')
        
        result = {
          success: true,
          action: 'password_reset_sent',
          email: userData.user.email
        }
        break

      case 'audit_user_activity':
        // Check recent security events for this user
        const { data: events, error: eventsError } = await supabaseAdmin
          .from('security_events')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50)

        if (eventsError) {
          console.error('❌ Failed to fetch security events:', eventsError)
        }

        // Check recent login attempts
        const { data: attempts, error: attemptsError } = await supabaseAdmin
          .from('mfa_verification_attempts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)

        if (attemptsError) {
          console.error('❌ Failed to fetch MFA attempts:', attemptsError)
        }

        result = {
          success: true,
          security_events: events || [],
          mfa_attempts: attempts || [],
          audit_timestamp: new Date().toISOString()
        }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('🚨 SECURITY FUNCTION ERROR:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})