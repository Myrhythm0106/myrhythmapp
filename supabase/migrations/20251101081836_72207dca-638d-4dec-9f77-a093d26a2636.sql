-- Create table for secure OAuth state management
CREATE TABLE IF NOT EXISTS public.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  used BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own OAuth states
CREATE POLICY "Users can view own OAuth states"
ON public.oauth_states FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role can manage all OAuth states
CREATE POLICY "Service role can manage all OAuth states"
ON public.oauth_states FOR ALL
USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_oauth_states_token ON public.oauth_states(token);
CREATE INDEX idx_oauth_states_expires_at ON public.oauth_states(expires_at);

-- Function to clean up expired OAuth states (run periodically)
CREATE OR REPLACE FUNCTION clean_expired_oauth_states()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.oauth_states
  WHERE expires_at < now()
    OR (used = true AND created_at < now() - interval '1 hour');
END;
$$;