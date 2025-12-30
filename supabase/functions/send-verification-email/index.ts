import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// ============================================
// CONFIGURATION - UPDATE THESE IF NEEDED
// ============================================
const SENDER_EMAIL = "MyRhythm <noreply@myrhythmapp.com>";
// For testing, you can use: "MyRhythm <onboarding@resend.dev>"
// Make sure myrhythmapp.com is verified in Resend: https://resend.com/domains

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Input validation schema
const requestSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  token: z.string().min(10, 'Invalid token').max(500, 'Token too long'),
  redirectUrl: z.string().url('Invalid redirect URL').max(500, 'URL too long'),
});

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();
  
  console.log(`📧 [${requestId}] ========== VERIFICATION EMAIL REQUEST ==========`);
  console.log(`📧 [${requestId}] Timestamp: ${new Date().toISOString()}`);
  console.log(`📧 [${requestId}] Method: ${req.method}`);

  if (req.method === "OPTIONS") {
    console.log(`📧 [${requestId}] Handling CORS preflight`);
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log(`❌ [${requestId}] Method not allowed: ${req.method}`);
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    // Step 1: Check API Key
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error(`❌ [${requestId}] CRITICAL: RESEND_API_KEY is not set!`);
      console.error(`❌ [${requestId}] Please add RESEND_API_KEY to Supabase Edge Function secrets`);
      console.error(`❌ [${requestId}] Go to: https://supabase.com/dashboard/project/_/settings/functions`);
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured",
          details: "RESEND_API_KEY is missing. Please contact support.",
          code: "MISSING_API_KEY"
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    console.log(`✅ [${requestId}] RESEND_API_KEY is configured (length: ${apiKey.length})`);

    // Step 2: Parse and validate request body
    console.log(`📧 [${requestId}] Parsing request body...`);
    let rawBody;
    try {
      rawBody = await req.json();
      console.log(`✅ [${requestId}] Request body parsed successfully`);
      console.log(`📧 [${requestId}] Email: ${rawBody.email}`);
      console.log(`📧 [${requestId}] Name: ${rawBody.name}`);
      console.log(`📧 [${requestId}] RedirectUrl: ${rawBody.redirectUrl}`);
      console.log(`📧 [${requestId}] Token length: ${rawBody.token?.length || 0}`);
    } catch (parseError) {
      console.error(`❌ [${requestId}] Failed to parse request body:`, parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body",
          code: "INVALID_JSON"
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Step 3: Validate input data
    console.log(`📧 [${requestId}] Validating input data...`);
    const validation = requestSchema.safeParse(rawBody);
    
    if (!validation.success) {
      console.error(`❌ [${requestId}] Validation failed:`, JSON.stringify(validation.error.errors));
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data", 
          details: validation.error.errors,
          code: "VALIDATION_FAILED"
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    console.log(`✅ [${requestId}] Input validation passed`);
    
    const { email, name, token, redirectUrl } = validation.data;
    const verificationLink = `${redirectUrl}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    
    console.log(`📧 [${requestId}] Verification link generated (length: ${verificationLink.length})`);

    // Step 4: Initialize Resend client
    console.log(`📧 [${requestId}] Initializing Resend client...`);
    const resend = new Resend(apiKey);

    // Step 5: Send email
    console.log(`📧 [${requestId}] Sending email via Resend...`);
    console.log(`📧 [${requestId}] From: ${SENDER_EMAIL}`);
    console.log(`📧 [${requestId}] To: ${email}`);
    
    const emailResponse = await resend.emails.send({
      from: SENDER_EMAIL,
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
              .token-code { font-family: 'Monaco', 'Menlo', monospace; font-size: 18px; font-weight: bold; color: #1f2937; letter-spacing: 2px; word-break: break-all; }
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

    const duration = Date.now() - startTime;

    // Step 6: Check response
    if (emailResponse.error) {
      console.error(`❌ [${requestId}] Resend API error:`, JSON.stringify(emailResponse.error));
      console.error(`❌ [${requestId}] Duration: ${duration}ms`);
      
      // Provide specific error messages based on error type
      let userMessage = "Failed to send verification email";
      let errorCode = "RESEND_ERROR";
      
      if (emailResponse.error.message?.includes("API key")) {
        userMessage = "Email service configuration error. Please contact support.";
        errorCode = "INVALID_API_KEY";
        console.error(`❌ [${requestId}] API Key issue detected - check RESEND_API_KEY`);
      } else if (emailResponse.error.message?.includes("domain")) {
        userMessage = "Email domain not verified. Please contact support.";
        errorCode = "DOMAIN_NOT_VERIFIED";
        console.error(`❌ [${requestId}] Domain issue - verify myrhythmapp.com at https://resend.com/domains`);
      } else if (emailResponse.error.message?.includes("rate")) {
        userMessage = "Too many emails sent. Please wait a few minutes and try again.";
        errorCode = "RATE_LIMITED";
      }

      return new Response(
        JSON.stringify({ 
          error: userMessage,
          code: errorCode,
          details: emailResponse.error.message
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`✅ [${requestId}] Email sent successfully!`);
    console.log(`✅ [${requestId}] Message ID: ${emailResponse.data?.id}`);
    console.log(`✅ [${requestId}] Duration: ${duration}ms`);
    console.log(`📧 [${requestId}] ========== REQUEST COMPLETE ==========`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${requestId}] Unexpected error:`, error);
    console.error(`❌ [${requestId}] Error name: ${error.name}`);
    console.error(`❌ [${requestId}] Error message: ${error.message}`);
    console.error(`❌ [${requestId}] Error stack: ${error.stack}`);
    console.error(`❌ [${requestId}] Duration: ${duration}ms`);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send verification email. Please try again.",
        code: "UNEXPECTED_ERROR",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);