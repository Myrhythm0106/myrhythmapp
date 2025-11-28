import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  memberName: string;
  memberEmail: string;
  inviterName: string;
  relationship: string;
  role: string;
  invitationToken: string;
  expiresAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      memberName, 
      memberEmail, 
      inviterName, 
      relationship, 
      role,
      invitationToken,
      expiresAt 
    }: InvitationEmailRequest = await req.json();

    const invitationUrl = `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/accept-invitation?token=${invitationToken}&email=${encodeURIComponent(memberEmail)}`;
    
    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailResponse = await resend.emails.send({
      from: "MyRhythm Support <info@myrhythmapp.com>",
      to: [memberEmail],
      subject: `MyRhythm - ${inviterName} has invited you to join their Support Circle`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Support Circle Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Join ${inviterName}'s Support Circle on MyRhythm</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #4c566a; margin-top: 0;">Hi ${memberName},</h2>
            <p><strong>${inviterName}</strong> has invited you to join their Support Circle on MyRhythm - a brain health and wellness platform.</p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #4c566a;">Invitation Details:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Your relationship:</strong> ${relationship}</li>
                <li><strong>Your role:</strong> ${role}</li>
                <li><strong>Invited by:</strong> ${inviterName}</li>
              </ul>
            </div>
          </div>

          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #2563eb; margin-top: 0;">As part of their support circle, you'll be able to:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
              <li>Receive updates on their progress and wellness journey</li>
              <li>Send encouraging messages to support their goals</li>
              <li>View the information they choose to share with you</li>
              <li>Help them stay accountable and motivated</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold; 
                      font-size: 16px; 
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
              Accept Invitation
            </a>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⏰ Important:</strong> This invitation expires on ${expirationDate} for security reasons.
            </p>
          </div>

          <div style="background: #f1f3f4; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #5f6368;">Privacy & Security</h4>
            <p style="margin: 0; font-size: 14px; color: #5f6368;">
              By accepting this invitation, you agree to respect ${inviterName}'s privacy and use shared information responsibly. 
              All data is securely encrypted and you'll only see what they choose to share with you.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e1e5e9; margin: 30px 0;">
          
          <div style="text-align: center; color: #6c757d; font-size: 12px;">
            <p>This email was sent by MyRhythm. If you didn't expect this invitation, you can safely ignore this email.</p>
            <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${invitationUrl}</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Support invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-support-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);