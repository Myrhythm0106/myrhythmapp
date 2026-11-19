ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS added_by_name text,
  ADD COLUMN IF NOT EXISTS added_by_user uuid;

CREATE OR REPLACE FUNCTION public.circle_diary_level(p_owner uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((
    SELECT CASE WHEN m.permissions->>'diary' IN ('busy','see','help') THEN m.permissions->>'diary' ELSE 'none' END
    FROM public.support_circle_members m
    WHERE m.user_id = p_owner
      AND m.status = 'active'
      AND auth.uid() IS NOT NULL
      AND lower(m.member_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid()))
    LIMIT 1
  ), 'none');
$$;

CREATE OR REPLACE FUNCTION public.my_shared_diaries()
RETURNS TABLE(owner_id uuid, owner_name text, level text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.user_id, COALESCE(NULLIF(p.name, ''), 'Someone in my circle'), m.permissions->>'diary'
  FROM public.support_circle_members m
  LEFT JOIN public.profiles p ON p.id = m.user_id
  WHERE m.status = 'active'
    AND auth.uid() IS NOT NULL
    AND lower(m.member_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid()))
    AND m.permissions->>'diary' IN ('busy','see','help');
$$;

CREATE OR REPLACE FUNCTION public.circle_diary(p_owner uuid, p_from date, p_to date)
RETURNS TABLE(id uuid, date date, "time" time, end_time time, title text, status text, is_busy_only boolean, added_by_name text, awaiting_confirmation boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE lvl text := public.circle_diary_level(p_owner);
BEGIN
  IF lvl = 'none' OR p_to < p_from OR p_to - p_from > 62 THEN RETURN; END IF;
  RETURN QUERY
  SELECT e.id, e.date, e.time, e.end_time,
         CASE WHEN lvl = 'busy' OR e.is_private THEN 'Busy' ELSE e.title END,
         e.status,
         (lvl = 'busy' OR e.is_private),
         CASE WHEN lvl = 'busy' OR e.is_private THEN NULL ELSE e.added_by_name END,
         e.requires_acceptance
  FROM public.calendar_events e
  WHERE e.user_id = p_owner AND e.date BETWEEN p_from AND p_to AND e.status <> 'cancelled'
  ORDER BY e.date, e.time;
END;
$$;

CREATE OR REPLACE FUNCTION public.circle_add_diary_item(p_owner uuid, p_title text, p_date date, p_time time)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid; who text;
BEGIN
  IF public.circle_diary_level(p_owner) <> 'help' THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF p_title IS NULL OR length(trim(p_title)) = 0 OR length(p_title) > 120 THEN RAISE EXCEPTION 'Invalid title'; END IF;
  SELECT m.member_name INTO who FROM public.support_circle_members m
   WHERE m.user_id = p_owner AND m.status = 'active'
     AND lower(m.member_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid())) LIMIT 1;
  INSERT INTO public.calendar_events (user_id, title, date, time, type, source, status, requires_acceptance, reminder_level, added_by_name, added_by_user)
  VALUES (p_owner, trim(p_title), p_date, p_time, 'task', 'support_circle', 'pending', true, 'off', who, auth.uid())
  RETURNING calendar_events.id INTO new_id;
  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.circle_diary_level(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.my_shared_diaries() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.circle_diary(uuid, date, date) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.circle_add_diary_item(uuid, text, date, time) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.circle_diary_level(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_shared_diaries() TO authenticated;
GRANT EXECUTE ON FUNCTION public.circle_diary(uuid, date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.circle_add_diary_item(uuid, text, date, time) TO authenticated;