ALTER TABLE public.accountability_alerts ADD COLUMN IF NOT EXISTS withdrawn_at timestamptz;

CREATE OR REPLACE FUNCTION public.notify_circle_of_step_completion(p_action_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _action record;
  _owner_name text;
  _member_labels text[] := '{}';
  _emails text[] := '{}';
  _alert_id uuid;
  _title text;
  _message text;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO _action FROM public.extracted_actions
  WHERE id = p_action_id AND user_id = _uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  SELECT COALESCE(name, 'Someone') INTO _owner_name FROM public.profiles WHERE id = _uid;

  -- Support circle members explicitly attached as watchers on this step
  SELECT COALESCE(array_agg(DISTINCT COALESCE(m.member_email, m.member_name)), '{}')
  INTO _member_labels
  FROM public.support_circle_members m
  WHERE m.user_id = _uid
    AND m.status = 'active'
    AND m.id = ANY (COALESCE(_action.assigned_watchers, ARRAY[]::uuid[]));

  -- Email-only recipients: the owner of the step plus anyone looped in / informed / consulted
  SELECT COALESCE(array_agg(DISTINCT e), '{}') INTO _emails
  FROM (
    SELECT _action.owner_email AS e
    UNION
    SELECT jsonb_array_elements(COALESCE(_action.adhoc_loop_ins, '[]'::jsonb)) ->> 'email'
    UNION
    SELECT jsonb_array_elements(COALESCE(_action.informed, '[]'::jsonb)) ->> 'email'
    UNION
    SELECT jsonb_array_elements(COALESCE(_action.consulted, '[]'::jsonb)) ->> 'email'
  ) src
  WHERE e IS NOT NULL AND e <> '' AND position('@' in e) > 1;

  IF array_length(_member_labels, 1) IS NULL AND array_length(_emails, 1) IS NULL THEN
    RETURN jsonb_build_object('success', true, 'notified', 0, 'emails', '[]'::jsonb);
  END IF;

  _title := _owner_name || ' finished: ' || left(_action.action_text, 120);
  _message := _owner_name || ' has finished "' || _action.action_text || '". Nothing is needed from you — this is just to keep you in the loop.';

  INSERT INTO public.accountability_alerts (
    user_id, alert_type, related_id, title, message, severity, target_members
  ) VALUES (
    _uid, 'task_completed', p_action_id, _title, _message, 'info', COALESCE(_member_labels, '{}')
  ) RETURNING id INTO _alert_id;

  RETURN jsonb_build_object(
    'success', true,
    'alert_id', _alert_id,
    'notified', COALESCE(array_length(_member_labels, 1), 0),
    'title', _title,
    'message', _message,
    'emails', to_jsonb(COALESCE(_emails, '{}'))
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.withdraw_step_completion_notice(p_action_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RETURN false;
  END IF;

  UPDATE public.accountability_alerts
  SET withdrawn_at = now()
  WHERE user_id = _uid
    AND related_id = p_action_id
    AND alert_type = 'task_completed'
    AND withdrawn_at IS NULL;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.my_completion_stats()
RETURNS TABLE(done_this_week integer, current_streak integer, open_steps integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _streak int := 0;
  _day date := current_date;
BEGIN
  IF _uid IS NULL THEN
    RETURN QUERY SELECT 0, 0, 0;
    RETURN;
  END IF;

  -- Consecutive days (ending today or yesterday) with at least one completion
  IF NOT EXISTS (
    SELECT 1 FROM public.extracted_actions
    WHERE user_id = _uid AND completion_date = _day
  ) THEN
    _day := _day - 1;
  END IF;

  WHILE EXISTS (
    SELECT 1 FROM public.extracted_actions
    WHERE user_id = _uid AND completion_date = _day
  ) LOOP
    _streak := _streak + 1;
    _day := _day - 1;
  END LOOP;

  RETURN QUERY
  SELECT
    (SELECT count(*)::int FROM public.extracted_actions
      WHERE user_id = _uid AND completion_date >= current_date - 6)::int,
    _streak,
    (SELECT count(*)::int FROM public.extracted_actions
      WHERE user_id = _uid
        AND archived_at IS NULL
        AND status NOT IN ('done', 'completed', 'cancelled'))::int;
END;
$$;