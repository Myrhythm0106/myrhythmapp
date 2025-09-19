-- Fix RLS policies for email_verifications table
-- Add INSERT policy to allow creating verification tokens during signup

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
    AND email = email_verifications.email
  )
  -- Prevent duplicate tokens for the same email within a reasonable timeframe
  AND NOT EXISTS (
    SELECT 1 FROM public.email_verifications 
    WHERE email = email_verifications.email 
    AND used = false 
    AND expires_at > now()
    AND created_at > now() - INTERVAL '5 minutes'
  )
);