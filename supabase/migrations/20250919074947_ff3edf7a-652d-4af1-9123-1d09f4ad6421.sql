-- Fix the RLS policy for email_verifications table
-- Drop the existing policy with the logical bug
DROP POLICY IF EXISTS "Allow inserting verification tokens during signup" ON public.email_verifications;

-- Create corrected INSERT policy with proper logic
CREATE POLICY "Allow inserting verification tokens during signup" 
ON public.email_verifications 
FOR INSERT 
WITH CHECK (
  -- Allow inserting tokens for valid user IDs that exist in auth.users
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = email_verifications.user_id
  )
  -- Ensure email matches the user's email
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = email_verifications.user_id 
    AND email::text = email_verifications.email
  )
  -- Prevent duplicate tokens for the same email within a reasonable timeframe
  AND NOT EXISTS (
    SELECT 1 FROM public.email_verifications ev2
    WHERE ev2.email = email_verifications.email 
    AND ev2.used = false 
    AND ev2.expires_at > now()
    AND ev2.created_at > now() - INTERVAL '5 minutes'
  )
);