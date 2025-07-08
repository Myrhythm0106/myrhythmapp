
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
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not configured");
      throw new Error("STRIPE_SECRET_KEY is not configured. Please add your Stripe secret key to the edge function secrets.");
    }

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

    const { plan_type, billing_period = 'monthly' } = await req.json();
    logStep("Plan details received", { plan_type, billing_period });

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

    // Enhanced pricing with annual options (GBP)
    const planPricing = {
      basic: { 
        monthly: { price: 599, name: "MyRhythm Align", description: "Foundation for aligning memory, focus, and daily rhythm" },
        annual: { price: 5750, name: "MyRhythm Align (Annual)", description: "Foundation for aligning memory, focus, and daily rhythm - Save £14.38/year" }
      },
      premium: { 
        monthly: { price: 999, name: "MyRhythm Flow", description: "Complete flow experience with advanced momentum building" },
        annual: { price: 9590, name: "MyRhythm Flow (Annual)", description: "Complete flow experience with advanced momentum building - Save £23.98/year" }
      },
      family: { 
        monthly: { price: 1999, name: "MyRhythm Thrive", description: "Complete family wellness journey to help everyone thrive" },
        annual: { price: 19190, name: "MyRhythm Thrive (Annual)", description: "Complete family wellness journey to help everyone thrive - Save £47.98/year" }
      }
    };

    const selectedPlan = planPricing[plan_type as keyof typeof planPricing] || planPricing.premium;
    const billingData = selectedPlan[billing_period as keyof typeof selectedPlan] || selectedPlan.monthly;
    logStep("Plan selected", { selectedPlan: billingData, plan_type, billing_period });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Create session based on billing period
    const sessionData: any = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "gbp", // Fixed to GBP
            product_data: { 
              name: billingData.name,
              description: billingData.description
            },
            unit_amount: billingData.price,
            recurring: { interval: billing_period === 'annual' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?trial_started=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/onboarding?step=4&cancelled=true`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    };

    // For monthly plans, add trial period
    if (billing_period === 'monthly') {
      sessionData.subscription_data = {
        trial_period_days: 7,
        metadata: {
          user_id: user.id,
          plan_type: plan_type,
          billing_period: billing_period
        }
      };
    } else {
      // For annual plans, immediate payment
      sessionData.subscription_data = {
        metadata: {
          user_id: user.id,
          plan_type: plan_type,
          billing_period: billing_period
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Create or update subscription record in our database
    await supabaseClient
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: billing_period === 'monthly' ? 'trial' : 'active',
        plan_type: plan_type,
        billing_period: billing_period,
        trial_start: billing_period === 'monthly' ? new Date().toISOString().split('T')[0] : null,
        trial_end: billing_period === 'monthly' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    logStep("Database updated with subscription");

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
