-- Add user_type and custom_user_type columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_type TEXT,
ADD COLUMN custom_user_type TEXT;

-- Add check constraint to ensure custom_user_type is only set when user_type is 'other'
ALTER TABLE public.profiles 
ADD CONSTRAINT check_custom_user_type 
CHECK (
  (user_type = 'other' AND custom_user_type IS NOT NULL) OR 
  (user_type != 'other' AND custom_user_type IS NULL) OR 
  (user_type IS NULL AND custom_user_type IS NULL)
);