
-- Migration: Move calendar OAuth tokens to Supabase Vault for encrypted storage
-- This addresses the security finding: Calendar Access Tokens Could Be Stolen by Hackers

-- Step 1: Drop dependent view
DROP VIEW IF EXISTS public.calendar_integrations_safe CASCADE;

-- Step 2: Drop policies that reference token columns
DROP POLICY IF EXISTS "Users can create integration metadata" ON public.calendar_integrations;
DROP POLICY IF EXISTS "Users can update non-sensitive settings only" ON public.calendar_integrations;

-- Step 3: Migrate existing tokens to Vault
DO $$
DECLARE
  integration_record RECORD;
BEGIN
  FOR integration_record IN 
    SELECT id, access_token, refresh_token, token_expires_at
    FROM public.calendar_integrations
    WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL
  LOOP
    -- Store access token in vault
    IF integration_record.access_token IS NOT NULL THEN
      INSERT INTO vault.secrets (name, secret)
      VALUES (
        'calendar_integration_access_' || integration_record.id::text,
        integration_record.access_token
      )
      ON CONFLICT (name) DO UPDATE
      SET secret = EXCLUDED.secret;
    END IF;
    
    -- Store refresh token in vault
    IF integration_record.refresh_token IS NOT NULL THEN
      INSERT INTO vault.secrets (name, secret)
      VALUES (
        'calendar_integration_refresh_' || integration_record.id::text,
        integration_record.refresh_token
      )
      ON CONFLICT (name) DO UPDATE
      SET secret = EXCLUDED.secret;
    END IF;
  END LOOP;
END $$;

-- Step 4: Drop the plaintext token columns
ALTER TABLE public.calendar_integrations
DROP COLUMN access_token,
DROP COLUMN refresh_token;

-- Step 5: Recreate RLS policies without token checks
CREATE POLICY "Users can create integration metadata" 
ON public.calendar_integrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update non-sensitive settings only"
ON public.calendar_integrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 6: Recreate safe view without token columns
CREATE VIEW public.calendar_integrations_safe AS
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

-- Grant select on the view
GRANT SELECT ON public.calendar_integrations_safe TO authenticated;

-- Step 7: Update get_calendar_integration_tokens to read from Vault
CREATE OR REPLACE FUNCTION public.get_calendar_integration_tokens(p_integration_id uuid)
RETURNS TABLE(access_token text, refresh_token text, token_expires_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_access_secret text;
  v_refresh_secret text;
  v_expires_at timestamp with time zone;
BEGIN
  -- Verify ownership
  SELECT user_id, token_expires_at INTO v_user_id, v_expires_at
  FROM public.calendar_integrations
  WHERE id = p_integration_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Integration not found';
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Retrieve tokens from Vault
  SELECT decrypted_secret INTO v_access_secret
  FROM vault.decrypted_secrets
  WHERE name = 'calendar_integration_access_' || p_integration_id::text;

  SELECT decrypted_secret INTO v_refresh_secret
  FROM vault.decrypted_secrets
  WHERE name = 'calendar_integration_refresh_' || p_integration_id::text;

  -- Return decrypted tokens
  RETURN QUERY
  SELECT 
    v_access_secret,
    v_refresh_secret,
    v_expires_at;
END;
$$;

-- Step 8: Update update_calendar_integration_tokens to write to Vault
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

  -- Update or insert access token in Vault
  INSERT INTO vault.secrets (name, secret)
  VALUES (
    'calendar_integration_access_' || p_integration_id::text,
    p_access_token
  )
  ON CONFLICT (name) DO UPDATE
  SET secret = EXCLUDED.secret,
      updated_at = now();

  -- Update or insert refresh token in Vault
  INSERT INTO vault.secrets (name, secret)
  VALUES (
    'calendar_integration_refresh_' || p_integration_id::text,
    p_refresh_token
  )
  ON CONFLICT (name) DO UPDATE
  SET secret = EXCLUDED.secret,
      updated_at = now();

  -- Update token expiry in calendar_integrations table
  UPDATE public.calendar_integrations
  SET 
    token_expires_at = p_token_expires_at,
    updated_at = now()
  WHERE id = p_integration_id;

  RETURN TRUE;
END;
$$;

-- Step 9: Add comment documenting the security model
COMMENT ON TABLE public.calendar_integrations IS 
'Calendar integration metadata. OAuth tokens (access_token, refresh_token) are stored encrypted in vault.secrets and accessed only via security definer functions get_calendar_integration_tokens() and update_calendar_integration_tokens().';

-- Step 10: Create cleanup function to remove orphaned vault secrets
CREATE OR REPLACE FUNCTION public.cleanup_calendar_integration_tokens()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete associated vault secrets when integration is deleted
  DELETE FROM vault.secrets
  WHERE name IN (
    'calendar_integration_access_' || OLD.id::text,
    'calendar_integration_refresh_' || OLD.id::text
  );
  
  RETURN OLD;
END;
$$;

-- Create trigger to cleanup vault secrets on integration deletion
DROP TRIGGER IF EXISTS cleanup_calendar_tokens_trigger ON public.calendar_integrations;
CREATE TRIGGER cleanup_calendar_tokens_trigger
BEFORE DELETE ON public.calendar_integrations
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_calendar_integration_tokens();
