-- Fix security issues
-- 1. Enable leaked password protection
UPDATE auth.config 
SET leaked_password_protection = true 
WHERE parameter = 'leaked_password_protection';

-- 2. Reduce OTP expiry time to 10 minutes (recommended)
UPDATE auth.config 
SET otp_expiry = 600 
WHERE parameter = 'otp_expiry';

-- 3. Add decision-specific fields to notes table
ALTER TABLE public.notes 
ADD COLUMN decision_type text,
ADD COLUMN decision_context text,
ADD COLUMN decision_outcome text,
ADD COLUMN reflection_date date,
ADD COLUMN decision_tags text[] DEFAULT '{}',
ADD COLUMN is_decision boolean DEFAULT false;

-- 4. Create index for decision queries
CREATE INDEX idx_notes_decisions ON public.notes (user_id, is_decision) WHERE is_decision = true;