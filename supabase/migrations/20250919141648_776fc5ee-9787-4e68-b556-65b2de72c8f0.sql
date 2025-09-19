-- Create RPC function to check user existence and verification status
CREATE OR REPLACE FUNCTION public.check_user_status(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  auth_user_record RECORD;
  profile_record RECORD;
  result JSONB;
BEGIN
  -- Check if user exists in auth.users
  SELECT id, email, email_confirmed_at, created_at
  INTO auth_user_record
  FROM auth.users
  WHERE email = p_email;
  
  IF NOT FOUND THEN
    -- User doesn't exist
    RETURN jsonb_build_object(
      'exists', false,
      'verified', false,
      'user_id', null,
      'name', null
    );
  END IF;
  
  -- Get profile information
  SELECT id, name
  INTO profile_record
  FROM public.profiles  
  WHERE id = auth_user_record.id;
  
  -- Return user status
  RETURN jsonb_build_object(
    'exists', true,
    'verified', (auth_user_record.email_confirmed_at IS NOT NULL),
    'user_id', auth_user_record.id,
    'name', COALESCE(profile_record.name, 'User')
  );
END;
$$;