
CREATE OR REPLACE FUNCTION public.generate_accountability_alert(
  p_user_id UUID,
  p_alert_type TEXT,
  p_related_id UUID DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $$
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
$$;
