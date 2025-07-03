
-- Create subscription management tables
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'canceled', 'past_due', 'incomplete')),
  plan_type TEXT NOT NULL DEFAULT 'premium' CHECK (plan_type IN ('basic', 'premium', 'family')),
  trial_start DATE,
  trial_end DATE,
  current_period_start DATE,
  current_period_end DATE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for payment methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment methods" 
  ON public.payment_methods 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment methods" 
  ON public.payment_methods 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Function to check subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub_record RECORD;
BEGIN
  SELECT * INTO sub_record
  FROM public.subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN 'no_subscription';
  END IF;
  
  -- Check if trial is still active
  IF sub_record.status = 'trial' AND sub_record.trial_end >= CURRENT_DATE THEN
    RETURN 'trial_active';
  END IF;
  
  -- Check if trial has expired
  IF sub_record.status = 'trial' AND sub_record.trial_end < CURRENT_DATE THEN
    RETURN 'trial_expired';
  END IF;
  
  RETURN sub_record.status;
END;
$$;

-- Function to create trial subscription
CREATE OR REPLACE FUNCTION public.create_trial_subscription(
  user_uuid UUID,
  stripe_customer_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_id UUID;
BEGIN
  INSERT INTO public.subscriptions (
    user_id,
    stripe_customer_id,
    status,
    plan_type,
    trial_start,
    trial_end
  ) VALUES (
    user_uuid,
    stripe_customer_id,
    'trial',
    'premium',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days'
  ) RETURNING id INTO subscription_id;
  
  RETURN subscription_id;
END;
$$;
