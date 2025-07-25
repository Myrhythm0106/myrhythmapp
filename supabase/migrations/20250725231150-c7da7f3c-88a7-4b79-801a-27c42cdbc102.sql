-- Fix ALL remaining security warnings

-- 1. Fix ALL functions with mutable search paths
-- Get all functions and ensure they have proper search_path

-- Fix handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email
  );
  RETURN new;
END;
$function$;

-- Fix cleanup_expired_voice_recordings function
DROP FUNCTION IF EXISTS public.cleanup_expired_voice_recordings() CASCADE;
CREATE OR REPLACE FUNCTION public.cleanup_expired_voice_recordings()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete expired recordings that are not legally required to be retained
  DELETE FROM public.voice_recordings
  WHERE expires_at < now()
  AND legal_retention_required = false;
  
  -- Update retention status for recordings past their retention period
  UPDATE public.voice_recordings
  SET metadata = metadata || jsonb_build_object('retention_expired', true)
  WHERE created_at + INTERVAL '1 day' * retention_period_days < now()
  AND legal_retention_required = true
  AND NOT (metadata->>'retention_expired')::boolean;
END;
$function$;

-- Fix ensure_daily_win_exists function
DROP FUNCTION IF EXISTS public.ensure_daily_win_exists() CASCADE;
CREATE OR REPLACE FUNCTION public.ensure_daily_win_exists()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- If this is a daily win being deleted, prevent if it's the only one for the day
  IF TG_OP = 'DELETE' AND OLD.is_daily_win = true THEN
    IF (SELECT COUNT(*) FROM public.daily_actions 
        WHERE user_id = OLD.user_id 
        AND date = OLD.date 
        AND is_daily_win = true 
        AND id != OLD.id) = 0 THEN
      RAISE EXCEPTION 'Cannot delete the only daily win for this date. Each day must have at least one daily win.';
    END IF;
  END IF;
  
  -- If updating a daily win to false, ensure there's still at least one daily win for the day
  IF TG_OP = 'UPDATE' AND OLD.is_daily_win = true AND NEW.is_daily_win = false THEN
    IF (SELECT COUNT(*) FROM public.daily_actions 
        WHERE user_id = NEW.user_id 
        AND date = NEW.date 
        AND is_daily_win = true 
        AND id != NEW.id) = 0 THEN
      RAISE EXCEPTION 'Cannot remove daily win status. Each day must have at least one daily win.';
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- Fix generate_backup_codes function
DROP FUNCTION IF EXISTS public.generate_backup_codes() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_backup_codes()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  codes JSONB := '[]'::jsonb;
  i INTEGER;
  code TEXT;
BEGIN
  -- Generate 10 backup codes
  FOR i IN 1..10 LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substr(md5(random()::text), 1, 8));
    codes := codes || jsonb_build_array(jsonb_build_object(
      'code', code,
      'used', false,
      'used_at', null
    ));
  END LOOP;
  
  RETURN codes;
END;
$function$;

-- Fix verify_backup_code function
DROP FUNCTION IF EXISTS public.verify_backup_code(uuid, text) CASCADE;
CREATE OR REPLACE FUNCTION public.verify_backup_code(p_user_id uuid, p_code text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  factor_record RECORD;
  updated_codes JSONB;
  code_found BOOLEAN := false;
BEGIN
  -- Get backup codes factor
  SELECT * INTO factor_record 
  FROM public.mfa_factors 
  WHERE user_id = p_user_id AND factor_type = 'backup_codes' AND is_enabled = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if code exists and is unused
  updated_codes := factor_record.backup_codes;
  
  FOR i IN 0..jsonb_array_length(updated_codes) - 1 LOOP
    IF (updated_codes->i->>'code' = upper(p_code)) AND 
       (updated_codes->i->>'used')::boolean = false THEN
      
      -- Mark code as used
      updated_codes := jsonb_set(
        updated_codes,
        array[i::text, 'used'],
        'true'::jsonb
      );
      updated_codes := jsonb_set(
        updated_codes,
        array[i::text, 'used_at'],
        to_jsonb(now())
      );
      
      code_found := true;
      EXIT;
    END IF;
  END LOOP;
  
  IF code_found THEN
    -- Update the backup codes
    UPDATE public.mfa_factors 
    SET backup_codes = updated_codes, updated_at = now()
    WHERE id = factor_record.id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$function$;

-- Fix get_user_subscription_status function  
DROP FUNCTION IF EXISTS public.get_user_subscription_status(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  sub_record RECORD;
BEGIN
  SELECT * INTO sub_record
  FROM public.subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN 'no_subscription';
  END IF;
  
  -- Check if trial is still active
  IF sub_record.status = 'trial' AND sub_record.trial_end >= CURRENT_DATE THEN
    RETURN 'trial_active';
  END IF;
  
  -- Check if trial has expired
  IF sub_record.status = 'trial' AND sub_record.trial_end < CURRENT_DATE THEN
    RETURN 'trial_expired';
  END IF;
  
  RETURN sub_record.status;
END;
$function$;

-- Fix create_trial_subscription function
DROP FUNCTION IF EXISTS public.create_trial_subscription(uuid, text) CASCADE;
CREATE OR REPLACE FUNCTION public.create_trial_subscription(user_uuid uuid, stripe_customer_id text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  subscription_id UUID;
BEGIN
  INSERT INTO public.subscriptions (
    user_id,
    stripe_customer_id,
    status,
    plan_type,
    trial_start,
    trial_end
  ) VALUES (
    user_uuid,
    stripe_customer_id,
    'trial',
    'premium',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days'
  ) RETURNING id INTO subscription_id;
  
  RETURN subscription_id;
END;
$function$;

-- Fix generate_accountability_alert function
DROP FUNCTION IF EXISTS public.generate_accountability_alert(uuid, text, uuid, text, text, text) CASCADE;
CREATE OR REPLACE FUNCTION public.generate_accountability_alert(p_user_id uuid, p_alert_type text, p_related_id uuid DEFAULT NULL::uuid, p_title text DEFAULT NULL::text, p_message text DEFAULT NULL::text, p_severity text DEFAULT 'info'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  alert_id UUID;
  target_members TEXT[];
BEGIN
  -- Get relevant support circle members based on alert type
  SELECT ARRAY_AGG(DISTINCT 
    CASE 
      WHEN member_email IS NOT NULL THEN member_email
      ELSE member_name 
    END
  )
  INTO target_members
  FROM public.support_circle_members 
  WHERE user_id = p_user_id 
  AND status = 'active'
  AND can_receive_alerts = true
  AND (
    (p_alert_type = 'task_completed' AND (permissions->>'calendar')::boolean = true) OR
    (p_alert_type = 'task_missed' AND (permissions->>'calendar')::boolean = true) OR
    (p_alert_type = 'streak_milestone' AND (permissions->>'goals')::boolean = true) OR
    (p_alert_type = 'concern_pattern' AND role = 'medical')
  );

  -- Insert the alert
  INSERT INTO public.accountability_alerts (
    user_id, alert_type, related_id, title, message, severity, target_members
  ) VALUES (
    p_user_id, p_alert_type, p_related_id, 
    COALESCE(p_title, 'Progress Update'), 
    COALESCE(p_message, 'New activity update available'),
    p_severity, 
    COALESCE(target_members, '{}')
  ) RETURNING id INTO alert_id;

  RETURN alert_id;
END;
$function$;

-- Fix log_security_event function
DROP FUNCTION IF EXISTS public.log_security_event(uuid, text, jsonb, inet, text) CASCADE;
CREATE OR REPLACE FUNCTION public.log_security_event(p_user_id uuid, p_event_type text, p_event_data jsonb DEFAULT '{}'::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, event_data, ip_address, user_agent
  ) VALUES (
    p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;

-- Re-create the trigger for handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Re-create the trigger for ensure_daily_win_exists  
DROP TRIGGER IF EXISTS ensure_daily_win_exists_trigger ON public.daily_actions;
CREATE TRIGGER ensure_daily_win_exists_trigger
  BEFORE UPDATE OR DELETE ON public.daily_actions
  FOR EACH ROW EXECUTE FUNCTION public.ensure_daily_win_exists();