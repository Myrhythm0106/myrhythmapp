import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface VerificationEmailRequest {
  email: string;
  name: string;
  token: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, name, token, redirectUrl }: VerificationEmailRequest = await req.json();

    if (!email || !name || !token || !redirectUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const verificationLink = `${redirectUrl}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    const emailResponse = await resend.emails.send({
      from: "MyRhythm <noreply@myrhythm.app>",
      to: [email],
      subject: "Verify your MyRhythm account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your MyRhythm Account</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
              .header p { color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px; }
              .content { padding: 40px 20px; text-align: center; }
              .content h2 { color: #1f2937; margin: 0 0 20px; font-size: 24px; }
              .content p { color: #6b7280; line-height: 1.6; margin: 0 0 30px; font-size: 16px; }
              .verify-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 0 30px; }
              .verify-button:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3); }
              .manual-token { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .token-code { font-family: 'Monaco', 'Menlo', monospace; font-size: 18px; font-weight: bold; color: #1f2937; letter-spacing: 2px; }
              .footer { background: #f9fafb; padding: 30px 20px; text-align: center; color: #6b7280; font-size: 14px; }
              .footer a { color: #667eea; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>MyRhythm</h1>
                <p>Welcome to your cognitive wellness journey</p>
              </div>
              <div class="content">
                <h2>Hi ${name}!</h2>
                <p>Thank you for joining MyRhythm. To complete your account setup and start your cognitive wellness journey, please verify your email address.</p>
                
                <a href="${verificationLink}" class="verify-button">Verify My Email</a>
                
                <div class="manual-token">
                  <p><strong>Alternative:</strong> If the button doesn't work, copy this verification code:</p>
                  <div class="token-code">${token}</div>
                  <p style="margin-top: 15px; font-size: 14px;">Enter this code on the verification page</p>
                </div>
                
                <p style="font-size: 14px; color: #9ca3af;">This verification link will expire in 24 hours for security.</p>
              </div>
              <div class="footer">
                <p>This email was sent by MyRhythm. If you didn't create an account, you can safely ignore this email.</p>
                <p><a href="mailto:support@myrhythm.app">Contact Support</a> | <a href="#">Privacy Policy</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send verification email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);