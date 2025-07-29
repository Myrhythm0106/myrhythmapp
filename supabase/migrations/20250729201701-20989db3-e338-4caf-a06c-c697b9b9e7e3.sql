-- Secure Support Circle Invitation System Migration

-- Add invitation expiration field
ALTER TABLE public.support_circle_members 
ADD COLUMN invitation_expires_at TIMESTAMP WITH TIME ZONE;

-- Update default status to 'pending' for new invitations
ALTER TABLE public.support_circle_members 
ALTER COLUMN status SET DEFAULT 'pending';

-- Create function to generate secure invitation tokens
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a cryptographically secure 32-character token
  token := encode(gen_random_bytes(24), 'base64');
  -- Remove characters that might cause URL issues
  token := replace(replace(replace(token, '+', ''), '/', ''), '=', '');
  -- Ensure exactly 32 characters
  token := substring(token, 1, 32);
  RETURN token;
END;
$$;

-- Create function to validate and accept invitations
CREATE OR REPLACE FUNCTION public.accept_invitation(
  p_token TEXT,
  p_user_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
  result JSONB;
BEGIN
  -- Find the invitation by token
  SELECT * INTO invitation_record
  FROM public.support_circle_members
  WHERE invitation_token = p_token
    AND status = 'pending'
    AND member_email = p_user_email
    AND (invitation_expires_at IS NULL OR invitation_expires_at > now());
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invitation token'
    );
  END IF;
  
  -- Accept the invitation
  UPDATE public.support_circle_members
  SET 
    status = 'active',
    joined_at = now(),
    invitation_token = NULL,
    invitation_expires_at = NULL,
    updated_at = now()
  WHERE id = invitation_record.id;
  
  -- Log security event
  INSERT INTO public.security_events (
    user_id, event_type, event_data
  ) VALUES (
    invitation_record.user_id,
    'invitation_accepted',
    jsonb_build_object(
      'member_id', invitation_record.id,
      'member_email', invitation_record.member_email,
      'accepted_at', now()
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'member_name', invitation_record.member_name,
    'relationship', invitation_record.relationship,
    'role', invitation_record.role
  );
END;
$$;

-- Create function to revoke invitations
CREATE OR REPLACE FUNCTION public.revoke_invitation(
  p_member_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.support_circle_members
  SET 
    status = 'revoked',
    invitation_token = NULL,
    invitation_expires_at = NULL,
    updated_at = now()
  WHERE id = p_member_id 
    AND user_id = p_user_id 
    AND status = 'pending';
    
  IF FOUND THEN
    -- Log security event
    INSERT INTO public.security_events (
      user_id, event_type, event_data
    ) VALUES (
      p_user_id,
      'invitation_revoked',
      jsonb_build_object(
        'member_id', p_member_id,
        'revoked_at', now()
      )
    );
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Clean up expired invitations (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_invitations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.support_circle_members
  SET 
    status = 'expired',
    invitation_token = NULL
  WHERE status = 'pending'
    AND invitation_expires_at < now();
    
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$;