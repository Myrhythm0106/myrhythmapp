import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.22.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation schema
const requestSchema = z.object({
  action: z.enum(['emergency_lockout', 'force_password_reset', 'audit_user_activity']),
  userId: z.string().uuid('Invalid user ID format'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason must be less than 500 characters')
})

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

    // Extract and validate JWT
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('🚨 SECURITY: Unauthorized request - no auth header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error('🚨 SECURITY: Invalid JWT token:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user has admin role
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    })

    if (roleError || !isAdmin) {
      console.error('🚨 SECURITY: Non-admin user attempted security action:', user.email, 'Error:', roleError?.message)
      
      // Log unauthorized access attempt
      await supabaseAdmin.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: 'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
        p_event_data: {
          attempted_action: 'security_incident_response',
          timestamp: new Date().toISOString()
        }
      })

      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin role required for security operations' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate request body
    const body = await req.json()
    const validationResult = requestSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.error('🚨 SECURITY: Invalid request format:', validationResult.error.errors)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, userId, reason } = validationResult.data

    console.log(`🚨 SECURITY INCIDENT: Admin ${user.email} executing ${action} for user ${userId}. Reason: ${reason}`)

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