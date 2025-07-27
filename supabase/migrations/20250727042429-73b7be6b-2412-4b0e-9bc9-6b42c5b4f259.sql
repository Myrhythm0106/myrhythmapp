-- Fix security warnings by adding proper search_path to functions
CREATE OR REPLACE FUNCTION public.update_support_message_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_watchers_of_action_completion(
  p_action_id UUID,
  p_user_id UUID,
  p_action_title TEXT,
  p_completion_status TEXT
)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  alert_id UUID;
  watcher_members UUID[];
BEGIN
  -- Get watchers for this action
  SELECT watchers INTO watcher_members
  FROM public.daily_actions 
  WHERE id = p_action_id AND user_id = p_user_id;
  
  -- Generate alert if there are watchers
  IF array_length(watcher_members, 1) > 0 THEN
    -- Get emails of watcher members
    SELECT public.generate_accountability_alert(
      p_user_id,
      CASE 
        WHEN p_completion_status = 'completed' THEN 'task_completed'
        ELSE 'task_missed'
      END,
      p_action_id,
      CASE 
        WHEN p_completion_status = 'completed' THEN 'Task Completed: ' || p_action_title
        ELSE 'Task Missed: ' || p_action_title
      END,
      CASE 
        WHEN p_completion_status = 'completed' THEN p_action_title || ' has been completed successfully!'
        ELSE p_action_title || ' was not completed as scheduled.'
      END,
      CASE 
        WHEN p_completion_status = 'completed' THEN 'info'
        ELSE 'warning'
      END
    ) INTO alert_id;
  END IF;
  
  RETURN alert_id;
END;
$$;