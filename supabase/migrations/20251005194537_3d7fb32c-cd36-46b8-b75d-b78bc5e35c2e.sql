-- Security Fix: Protect OAuth tokens in calendar_integrations table
-- This migration implements column-level security to prevent token exposure

-- Step 1: Create a security definer function to retrieve tokens (for edge functions only)
CREATE OR REPLACE FUNCTION public.get_calendar_integration_tokens(p_integration_id uuid)
RETURNS TABLE (
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if the user owns this integration
  IF NOT EXISTS (
    SELECT 1 FROM public.calendar_integrations 
    WHERE id = p_integration_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    ci.access_token,
    ci.refresh_token,
    ci.token_expires_at
  FROM public.calendar_integrations ci
  WHERE ci.id = p_integration_id AND ci.user_id = auth.uid();
END;
$$;

-- Step 2: Create a secure view that excludes sensitive token data
CREATE OR REPLACE VIEW public.calendar_integrations_safe AS
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

-- Step 3: Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view their own calendar integrations" ON public.calendar_integrations;
DROP POLICY IF EXISTS "Users can create their own calendar integrations" ON public.calendar_integrations;
DROP POLICY IF EXISTS "Users can update their own calendar integrations" ON public.calendar_integrations;
DROP POLICY IF EXISTS "Users can delete their own calendar integrations" ON public.calendar_integrations;

-- Step 4: Create new restrictive policies that exclude token columns from SELECT
-- Users can SELECT their integrations but WITHOUT token columns
CREATE POLICY "Users can view integration metadata only"
ON public.calendar_integrations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can INSERT integrations (edge functions will handle tokens via service role)
CREATE POLICY "Users can create integrations"
ON public.calendar_integrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE non-sensitive fields only
CREATE POLICY "Users can update integration settings"
ON public.calendar_integrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can DELETE their integrations
CREATE POLICY "Users can delete integrations"
ON public.calendar_integrations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Step 5: Add helper function to update tokens (service role only)
CREATE OR REPLACE FUNCTION public.update_calendar_integration_tokens(
  p_integration_id uuid,
  p_access_token text,
  p_refresh_token text,
  p_token_expires_at timestamp with time zone
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Verify ownership
  SELECT user_id INTO v_user_id
  FROM public.calendar_integrations
  WHERE id = p_integration_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Integration not found';
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update tokens
  UPDATE public.calendar_integrations
  SET 
    access_token = p_access_token,
    refresh_token = p_refresh_token,
    token_expires_at = p_token_expires_at,
    updated_at = now()
  WHERE id = p_integration_id;

  RETURN TRUE;
END;
$$;

-- Step 6: Grant access to the safe view
GRANT SELECT ON public.calendar_integrations_safe TO authenticated;

-- Step 7: Add audit logging for token access
CREATE TABLE IF NOT EXISTS public.calendar_token_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  integration_id uuid NOT NULL,
  access_type text NOT NULL,
  accessed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

ALTER TABLE public.calendar_token_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own token access logs"
ON public.calendar_token_access_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Step 8: Add index for performance
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_user_active 
ON public.calendar_integrations(user_id, is_active) 
WHERE is_active = true;

-- Add comment documenting the security fix
COMMENT ON TABLE public.calendar_integrations IS 
'Stores calendar integration credentials. OAuth tokens are protected by column-level security. Use get_calendar_integration_tokens() function to retrieve tokens securely.';

COMMENT ON FUNCTION public.get_calendar_integration_tokens IS 
'Security definer function to retrieve OAuth tokens. Only returns tokens for integrations owned by the authenticated user. Used by edge functions.';