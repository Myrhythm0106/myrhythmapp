import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TRIAL-REMINDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase with service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize Resend for email notifications
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    if (!resend) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Find trials that are ending in 2 days (day 5 of 7-day trial) and haven't been reminded
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2); // 2 days from now
    const targetDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    logStep("Looking for trials ending on", { targetDate: targetDateStr });

    const { data: trialsToRemind, error: queryError } = await supabaseClient
      .from('trial_subscriptions')
      .select(`
        id,
        user_id,
        trial_end_date,
        reminder_sent_day5,
        plan_type,
        profiles!inner(email, name)
      `)
      .eq('trial_end_date', targetDateStr)
      .eq('reminder_sent_day5', false);

    if (queryError) {
      throw new Error(`Query error: ${queryError.message}`);
    }

    logStep("Found trials to remind", { count: trialsToRemind?.length || 0 });

    if (!trialsToRemind || trialsToRemind.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No trials need reminders today",
        processed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let processed = 0;
    let errors = [];

    for (const trial of trialsToRemind) {
      try {
        // Fix: extract the first profile from the array
        const userProfile = Array.isArray(trial.profiles) ? trial.profiles[0] : trial.profiles;
        if (!userProfile?.email) {
          logStep("Skipping trial - no user email", { trialId: trial.id });
          continue;
        }

        // Send reminder email
        const emailResponse = await resend.emails.send({
          from: "MyRhythm <noreply@myrhythm.com>",
          to: [userProfile.email],
          subject: "Your MyRhythm trial ends in 2 days",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Your MyRhythm Trial Ends Soon</h1>
              
              <p>Hi ${userProfile.name || 'there'},</p>
              
              <p>We hope you're enjoying your MyRhythm ${trial.plan_type} plan trial! This is a friendly reminder that your 7-day free trial will end in <strong>2 days</strong> on ${trial.trial_end_date}.</p>
              
              <p>After your trial ends, you'll be automatically charged for your ${trial.plan_type} subscription. If you'd like to make any changes to your subscription or cancel, you can do so anytime from your account settings.</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1f2937;">What happens next?</h3>
                <ul style="color: #4b5563;">
                  <li>Your trial continues until ${trial.trial_end_date}</li>
                  <li>After that, you'll be charged for your chosen plan</li>
                  <li>You can cancel anytime with no commitment</li>
                </ul>
              </div>
              
              <p>
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('supabase.co', 'lovable.app')}/dashboard" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Continue to MyRhythm
                </a>
              </p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you have any questions, just reply to this email. We're here to help!<br>
                The MyRhythm Team
              </p>
            </div>
          `,
        });

        logStep("Email sent successfully", { 
          trialId: trial.id, 
          email: userProfile.email,
          emailId: emailResponse.data?.id 
        });

        // Mark reminder as sent
        const { error: updateError } = await supabaseClient
          .from('trial_subscriptions')
          .update({ 
            reminder_sent_day5: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', trial.id);

        if (updateError) {
          throw new Error(`Update error for trial ${trial.id}: ${updateError.message}`);
        }

        processed++;
        logStep("Trial reminder processed", { trialId: trial.id });

      } catch (error) {
        const errorMsg = `Failed to process trial ${trial.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        logStep("ERROR processing trial", { trialId: trial.id, error: errorMsg });
        errors.push(errorMsg);
      }
    }

    return new Response(JSON.stringify({ 
      message: `Processed ${processed} trial reminders`,
      processed,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in trial-reminder", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});