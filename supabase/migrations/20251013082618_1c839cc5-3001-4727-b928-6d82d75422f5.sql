-- Add persona_mode column to profiles table for Recovery vs Executive Mode
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS persona_mode text DEFAULT 'recovery' CHECK (persona_mode IN ('recovery', 'executive'));

-- Create index for faster persona_mode lookups
CREATE INDEX IF NOT EXISTS idx_profiles_persona_mode ON public.profiles(persona_mode);

COMMENT ON COLUMN public.profiles.persona_mode IS 'User experience mode: recovery (therapeutic language) or executive (professional language)';
