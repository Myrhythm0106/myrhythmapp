
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { plan_type } = await req.json();
    logStep("Plan type received", { plan_type });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Enhanced pricing based on plan with updated names and proper trial setup
    const planPricing = {
      basic: { price: 599, name: "MyRhythm Align", description: "Essential tools for cognitive wellness" },
      premium: { price: 999, name: "MyRhythm Flow", description: "Complete MyRhythm experience with all features" },
      family: { price: 1999, name: "MyRhythm Thrive", description: "Full family support with dedicated case management" }
    };

    const selectedPlan = planPricing[plan_type as keyof typeof planPricing] || planPricing.premium;
    logStep("Plan selected", { selectedPlan, plan_type });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: selectedPlan.name,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          user_id: user.id,
          plan_type: plan_type
        }
      },
      success_url: `${origin}/dashboard?trial_started=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/onboarding?step=5&cancelled=true`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Create or update subscription record in our database
    await supabaseClient
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: 'trial',
        plan_type: plan_type,
        trial_start: new Date().toISOString().split('T')[0],
        trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    logStep("Database updated with trial subscription");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
