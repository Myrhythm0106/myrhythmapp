-- Add onboarding progress tracking to profiles table
-- This allows us to track where users are in the onboarding flow

-- Add onboarding_step column to track current onboarding progress
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'not_started';

-- Add onboarding_data column to store step-specific data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_step ON public.profiles(onboarding_step);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.onboarding_step IS 'Tracks user progress through onboarding flow: not_started, authentication, user-profile, plan-selection, assessment, complete';
COMMENT ON COLUMN public.profiles.onboarding_data IS 'Stores step-specific data during onboarding (user type, preferences, etc)';

-- Update existing users to have onboarding_step set based on onboarding_completed flag
UPDATE public.profiles 
SET onboarding_step = CASE 
  WHEN onboarding_completed = true THEN 'complete'
  ELSE 'not_started'
END
WHERE onboarding_step IS NULL OR onboarding_step = 'not_started';
