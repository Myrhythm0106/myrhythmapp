import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, creating trial subscription");
      
      // Create trial subscription in database
      const { data: subscription, error: subError } = await supabaseClient
        .rpc('create_trial_subscription', { user_uuid: user.id });
      
      if (subError) {
        logStep("Error creating trial subscription", { error: subError });
        throw new Error(`Database error: ${subError.message}`);
      }

      return new Response(JSON.stringify({ 
        subscribed: false,
        trial_active: true,
        trial_days_left: 7,
        subscription_tier: 'premium'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    let subscribed = false;
    let trial_active = false;
    let trial_days_left = 0;
    let subscription_tier = 'premium';
    let subscription_end = null;

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      subscribed = subscription.status === 'active' || subscription.status === 'trialing';
      trial_active = subscription.status === 'trialing';
      
      if (trial_active && subscription.trial_end) {
        const trialEndDate = new Date(subscription.trial_end * 1000);
        const now = new Date();
        trial_days_left = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      }

      if (subscription.current_period_end) {
        subscription_end = new Date(subscription.current_period_end * 1000).toISOString();
      }

      // Determine tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      if (amount <= 999) {
        subscription_tier = "Basic";
      } else if (amount <= 1499) {
        subscription_tier = "Premium";
      } else {
        subscription_tier = "Family";
      }

      // Update database
      await supabaseClient
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          status: subscription.status === 'trialing' ? 'trial' : subscription.status,
          plan_type: subscription_tier.toLowerCase(),
          trial_start: trial_active && subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString().split('T')[0] : null,
          trial_end: trial_active && subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString().split('T')[0] : null,
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString().split('T')[0] : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString().split('T')[0] : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    }

    logStep("Subscription status determined", { subscribed, trial_active, trial_days_left, subscription_tier });

    return new Response(JSON.stringify({
      subscribed,
      trial_active,
      trial_days_left,
      subscription_tier,
      subscription_end
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
