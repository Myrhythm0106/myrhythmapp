import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface VerifyEmailRequest {
  email: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, token }: VerifyEmailRequest = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: "Email and token are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if token exists and is valid in our custom verification table
    const { data: verificationData, error: verificationError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("token", token)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (verificationError || !verificationData) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification token" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark token as used
    const { error: updateError } = await supabase
      .from("email_verifications")
      .update({ used: true, verified_at: new Date().toISOString() })
      .eq("id", verificationData.id);

    if (updateError) {
      console.error("Error updating verification token:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to process verification" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update user's email_confirmed_at in auth.users using admin API
    // Get users by email using proper method
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }
    
    const userData = userList.users.find(u => u.email === email);
    if (!userData) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Confirm the user's email
    const { error: confirmError } = await supabase.auth.admin.updateUserById(
      userData.id,
      { email_confirm: true }
    );

    if (confirmError) {
      console.error("Error confirming user email:", confirmError);
      return new Response(
        JSON.stringify({ error: "Failed to confirm email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully",
        user_id: userData.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error verifying email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to verify email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);