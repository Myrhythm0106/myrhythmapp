import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  memberName: string;
  memberEmail: string;
  inviterName: string;
  relationship: string;
  role: string;
  invitationToken: string;
  permissions: Record<string, boolean>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const {
      memberName,
      memberEmail,
      inviterName,
      relationship,
      role,
      invitationToken,
      permissions
    }: InvitationEmailRequest = await req.json();

    // Validate required fields
    if (!memberEmail || !memberName || !invitationToken) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate invitation URL
    const baseUrl = Deno.env.get("SITE_URL") || "http://localhost:3000";
    const invitationUrl = `${baseUrl}/accept-invitation?token=${invitationToken}&email=${encodeURIComponent(memberEmail)}`;

    // Create permission list for email
    const enabledPermissions = Object.entries(permissions)
      .filter(([_, enabled]) => enabled)
      .map(([permission, _]) => {
        const labels = {
          mood: "Mood tracking",
          health: "Health information", 
          calendar: "Calendar & activities",
          goals: "Goals & progress",
          gratitude: "Gratitude entries"
        };
        return labels[permission as keyof typeof labels] || permission;
      });

    const permissionsList = enabledPermissions.length > 0 
      ? enabledPermissions.join(", ")
      : "Basic viewing access";

    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not found, simulating email send");
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email simulated (no RESEND_API_KEY configured)",
          invitationUrl 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MyRhythm <noreply@resend.dev>",
        to: [memberEmail],
        subject: `MyRhythm - ${inviterName} invited you to their Support Circle`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8B5CF6; margin: 0;">MyRhythm</h1>
              <p style="color: #6B7280; margin: 5px 0;">Support Circle Invitation</p>
            </div>
            
            <div style="background: #F9FAFB; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1F2937; margin-top: 0;">Hi ${memberName},</h2>
              <p style="color: #4B5563; line-height: 1.6;">
                <strong>${inviterName}</strong> has invited you to join their MyRhythm Support Circle as their <strong>${relationship}</strong>.
              </p>
              
              <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #374151;"><strong>Your Role:</strong> ${role}</p>
                <p style="margin: 10px 0 0 0; color: #374151;"><strong>Access Permissions:</strong> ${permissionsList}</p>
              </div>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${invitationUrl}" style="background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <div style="background: #FEF3C7; padding: 15px; border-radius: 6px; border-left: 4px solid #F59E0B; margin: 25px 0;">
              <p style="margin: 0; color: #92400E; font-size: 14px;">
                <strong>Security Notice:</strong> This invitation will expire in 48 hours. Only accept if you trust ${inviterName} and want to support their wellness journey.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <h3 style="color: #1F2937; font-size: 16px;">What is MyRhythm?</h3>
              <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
                MyRhythm is a wellness platform that helps people track their mood, health, goals, and daily activities. 
                Support Circle members can help provide encouragement and stay connected with their loved one's wellness journey.
              </p>
              
              <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
                If you didn't expect this invitation or don't know ${inviterName}, you can safely ignore this email.
                <br><br>
                For questions about this invitation, please contact ${inviterName} directly.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.id,
        invitationUrl 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending invitation email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send invitation email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);