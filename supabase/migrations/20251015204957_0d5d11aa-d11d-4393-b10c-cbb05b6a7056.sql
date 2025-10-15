-- Create Premium Trial Subscription for investor demo
-- No recording limits for 30 days
INSERT INTO public.subscriptions (
  user_id, 
  plan_type, 
  status, 
  trial_start, 
  trial_end
)
VALUES (
  '8d35ff32-d170-404a-93af-e3b6eed04333',
  'premium',
  'trial',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days'
)
ON CONFLICT DO NOTHING;