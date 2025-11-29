import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderWithEvent {
  id: string;
  event_id: string;
  user_id: string;
  reminder_time: string;
  reminder_methods: string[];
  calendar_events: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string | null;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  persona_mode: string | null;
}

// Persona-specific reminder messages
const getPersonaMessage = (persona: string | null, eventTitle: string): { subject: string; body: string } => {
  const p = persona?.toLowerCase() || 'general';
  
  const messages: Record<string, { subject: string; body: string }> = {
    student: {
      subject: `📚 Study Reminder: ${eventTitle}`,
      body: `Hey! Just a heads up - "${eventTitle}" is coming up soon. You've got this! 💪`
    },
    executive: {
      subject: `📋 Meeting Prep: ${eventTitle}`,
      body: `Reminder: "${eventTitle}" is scheduled shortly. Time to prepare and execute.`
    },
    recovery: {
      subject: `🌟 Gentle Reminder: ${eventTitle}`,
      body: `Hi there! This is a gentle reminder about "${eventTitle}". Take your time, you're doing great.`
    },
    caregiver: {
      subject: `💙 Care Reminder: ${eventTitle}`,
      body: `Reminder: "${eventTitle}" is coming up. You're doing an amazing job caring for others - don't forget yourself too.`
    },
    general: {
      subject: `⏰ Reminder: ${eventTitle}`,
      body: `Heads up! "${eventTitle}" is scheduled soon. Don't forget!`
    }
  };

  return messages[p] || messages.general;
};

// Calculate if reminder should be sent based on reminder_time type
const shouldSendReminder = (reminderTime: string, eventDate: string, eventTime: string): boolean => {
  const now = new Date();
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);
  const diffMs = eventDateTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  switch (reminderTime) {
    case '5_minutes_before':
      return diffMinutes <= 5 && diffMinutes > 0;
    case '15_minutes_before':
      return diffMinutes <= 15 && diffMinutes > 0;
    case '30_minutes_before':
      return diffMinutes <= 30 && diffMinutes > 0;
    case '1_hour_before':
      return diffMinutes <= 60 && diffMinutes > 0;
    case '1_day_before':
      return diffMinutes <= 1440 && diffMinutes > 1380; // 24h to 23h before
    case 'morning_of':
      // Send at 8 AM on the event day
      const eventDay = new Date(eventDate).toDateString();
      const today = now.toDateString();
      const currentHour = now.getHours();
      return eventDay === today && currentHour >= 8 && currentHour < 9;
    default:
      return false;
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔔 Starting send-scheduled-reminders function");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all active reminders that haven't been sent
    const { data: reminders, error: remindersError } = await supabase
      .from("event_reminders")
      .select(`
        id,
        event_id,
        user_id,
        reminder_time,
        reminder_methods,
        calendar_events (
          id,
          title,
          date,
          time,
          description
        )
      `)
      .eq("is_active", true)
      .is("sent_at", null);

    if (remindersError) {
      console.error("Error fetching reminders:", remindersError);
      throw remindersError;
    }

    console.log(`📋 Found ${reminders?.length || 0} pending reminders`);

    if (!reminders || reminders.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No reminders to send" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const reminder of reminders as ReminderWithEvent[]) {
      try {
        // Check if reminder should be sent now
        if (!reminder.calendar_events) {
          console.log(`⚠️ Reminder ${reminder.id} has no associated event, skipping`);
          continue;
        }

        const { date, time, title } = reminder.calendar_events;
        
        if (!shouldSendReminder(reminder.reminder_time, date, time)) {
          continue; // Not time yet
        }

        console.log(`📤 Processing reminder ${reminder.id} for event: ${title}`);

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, name, persona_mode")
          .eq("id", reminder.user_id)
          .single();

        if (profileError || !profile) {
          console.error(`Error fetching profile for user ${reminder.user_id}:`, profileError);
          continue;
        }

        const { subject, body } = getPersonaMessage(profile.persona_mode, title);
        const methods = reminder.reminder_methods || ["in_app"];

        // Send email if method includes email and we have Resend API key
        if (methods.includes("email") && resendApiKey && profile.email) {
          try {
            const emailResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "MyRhythm <reminders@myrhythm.app>",
                to: [profile.email],
                subject,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0d9488;">${subject}</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #374151;">${body}</p>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                      📅 ${date} at ${time}
                    </p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      <p style="font-size: 12px; color: #9ca3af;">
                        This reminder was sent by MyRhythm. 
                        <a href="https://myrhythm.app/settings" style="color: #0d9488;">Manage your reminder preferences</a>
                      </p>
                    </div>
                  </div>
                `,
              }),
            });

            if (emailResponse.ok) {
              console.log(`✉️ Email sent to ${profile.email}`);
            } else {
              const errorText = await emailResponse.text();
              console.error(`Email send failed:`, errorText);
            }
          } catch (emailError) {
            console.error(`Email error:`, emailError);
          }
        }

        // Create in-app notification
        if (methods.includes("in_app") || methods.includes("push")) {
          const { error: notifError } = await supabase
            .from("cross_device_notifications")
            .insert({
              user_id: reminder.user_id,
              notification_type: "reminder",
              device_source: "server",
              data: {
                event_id: reminder.event_id,
                event_title: title,
                reminder_time: `${date} at ${time}`,
                action_id: reminder.event_id,
              },
            });

          if (notifError) {
            console.error(`Error creating in-app notification:`, notifError);
          } else {
            console.log(`📱 In-app notification created for user ${reminder.user_id}`);
          }
        }

        // Mark reminder as sent
        const { error: updateError } = await supabase
          .from("event_reminders")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", reminder.id);

        if (updateError) {
          console.error(`Error updating reminder ${reminder.id}:`, updateError);
          errors.push(`Failed to update reminder ${reminder.id}`);
        } else {
          sentCount++;
          console.log(`✅ Reminder ${reminder.id} marked as sent`);
        }
      } catch (reminderError) {
        console.error(`Error processing reminder ${reminder.id}:`, reminderError);
        errors.push(`Error processing reminder ${reminder.id}: ${reminderError}`);
      }
    }

    console.log(`📊 Summary: ${sentCount} reminders sent, ${errors.length} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
