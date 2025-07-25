-- Fix database function search paths for security
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.generate_backup_codes()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.verify_backup_code(p_user_id uuid, p_code text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.create_trial_subscription(user_uuid uuid, stripe_customer_id text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.generate_accountability_alert(p_user_id uuid, p_alert_type text, p_related_id uuid DEFAULT NULL::uuid, p_title text DEFAULT NULL::text, p_message text DEFAULT NULL::text, p_severity text DEFAULT 'info'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

-- Create security events logging table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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