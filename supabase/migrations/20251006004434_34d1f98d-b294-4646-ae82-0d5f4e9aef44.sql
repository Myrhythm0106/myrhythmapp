
-- Drop and recreate the calendar_integrations_safe view with SECURITY INVOKER
DROP VIEW IF EXISTS public.calendar_integrations_safe CASCADE;

CREATE VIEW public.calendar_integrations_safe 
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  provider,
  account_email,
  account_name,
  is_active,
  sync_enabled,
  last_sync,
  sync_settings,
  token_expires_at,
  created_at,
  updated_at
FROM public.calendar_integrations;

COMMENT ON VIEW public.calendar_integrations_safe IS 
'Safe view of calendar integrations without sensitive token data. Access tokens are stored in vault.secrets.';

-- Grant SELECT to authenticated users
GRANT SELECT ON public.calendar_integrations_safe TO authenticated;
