-- Fix security definer view issue by recreating as a regular view
DROP VIEW IF EXISTS public.calendar_integrations_safe;

-- Create view without security definer (regular view)
CREATE VIEW public.calendar_integrations_safe 
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  provider,
  account_email,
  account_name,
  token_expires_at,
  is_active,
  sync_enabled,
  last_sync,
  sync_settings,
  created_at,
  updated_at,
  -- Indicate if tokens exist without exposing them
  (access_token IS NOT NULL) as has_access_token,
  (refresh_token IS NOT NULL) as has_refresh_token
FROM public.calendar_integrations;

-- Enable RLS on the view
ALTER VIEW public.calendar_integrations_safe SET (security_invoker = on);

-- Grant access to authenticated users
GRANT SELECT ON public.calendar_integrations_safe TO authenticated;

COMMENT ON VIEW public.calendar_integrations_safe IS 
'Safe view of calendar integrations that excludes OAuth tokens. Use get_calendar_integration_tokens() function to retrieve tokens securely in edge functions.';