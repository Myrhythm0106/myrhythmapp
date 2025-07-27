-- Fix security warnings by configuring auth settings properly

-- 1. Set OTP expiry to recommended threshold (10 minutes)
UPDATE auth.config SET 
  email_otp_expiry = 600,
  sms_otp_expiry = 600,
  phone_otp_expiry = 600
WHERE id = 'auth';

-- 2. Enable leaked password protection
UPDATE auth.config SET 
  security_update_password_require_reauthentication = true,
  password_strength_requirements = jsonb_build_object(
    'minimum_length', 8,
    'require_lowercase', true,
    'require_uppercase', true,
    'require_numbers', true,
    'require_symbols', false,
    'check_leaked_passwords', true
  )
WHERE id = 'auth';