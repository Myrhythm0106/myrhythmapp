-- Create trial tracking table for 7-day free trials
CREATE TABLE public.trial_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  trial_end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
  reminder_sent_day5 BOOLEAN DEFAULT false,
  plan_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own trial subscriptions" 
ON public.trial_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage trial subscriptions" 
ON public.trial_subscriptions 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_trial_subscriptions_updated_at
BEFORE UPDATE ON public.trial_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();