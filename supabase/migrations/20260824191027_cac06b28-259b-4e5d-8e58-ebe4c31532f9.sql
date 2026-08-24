-- 1. Columns
ALTER TABLE public.extracted_actions ADD COLUMN IF NOT EXISTS archived_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_extracted_actions_user_archived ON public.extracted_actions (user_id, archived_at);

ALTER TABLE public.voice_recordings ADD COLUMN IF NOT EXISTS audio_deleted_at timestamptz;

-- 2. Captures survive audio deletion
ALTER TABLE public.meeting_recordings ALTER COLUMN recording_id DROP NOT NULL;
ALTER TABLE public.meeting_recordings DROP CONSTRAINT IF EXISTS meeting_recordings_recording_id_fkey;
ALTER TABLE public.meeting_recordings
  ADD CONSTRAINT meeting_recordings_recording_id_fkey
  FOREIGN KEY (recording_id) REFERENCES public.voice_recordings(id) ON DELETE SET NULL;

-- 3. Per-item permission check
CREATE OR REPLACE FUNCTION public.can_access_item_thread(_target_type text, _target_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _viewer uuid := auth.uid();
  _email text;
  _owner uuid;
  _member_id uuid;
  _permitted boolean := false;
BEGIN
  IF _viewer IS NULL THEN
    RETURN false;
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _viewer;

  IF _target_type = 'action' THEN
    SELECT user_id INTO _owner FROM public.extracted_actions WHERE id = _target_id;
  ELSIF _target_type = 'recording' THEN
    SELECT user_id INTO _owner FROM public.meeting_recordings WHERE id = _target_id;
  ELSE
    RETURN false;
  END IF;

  IF _owner IS NULL THEN
    RETURN false;
  END IF;

  IF _owner = _viewer THEN
    RETURN true;
  END IF;

  SELECT id INTO _member_id
  FROM public.support_circle_members
  WHERE user_id = _owner
    AND status = 'active'
    AND (member_email = _email OR member_user_id = _viewer)
  LIMIT 1;

  IF _member_id IS NULL THEN
    RETURN false;
  END IF;

  IF _target_type = 'action' THEN
    SELECT (
      _member_id = ANY (coalesce(ea.assigned_watchers, ARRAY[]::uuid[]))
      OR coalesce(ea.adhoc_loop_ins::text, '') ILIKE '%' || coalesce(_email, '~none~') || '%'
    ) INTO _permitted
    FROM public.extracted_actions ea
    WHERE ea.id = _target_id;
  ELSE
    SELECT EXISTS (
      SELECT 1
      FROM public.extracted_actions ea
      WHERE ea.meeting_recording_id = _target_id
        AND (
          _member_id = ANY (coalesce(ea.assigned_watchers, ARRAY[]::uuid[]))
          OR coalesce(ea.adhoc_loop_ins::text, '') ILIKE '%' || coalesce(_email, '~none~') || '%'
        )
    ) INTO _permitted;
  END IF;

  RETURN coalesce(_permitted, false);
END;
$$;

-- 4. Notes thread
CREATE TABLE IF NOT EXISTS public.item_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('action','recording')),
  target_id uuid NOT NULL,
  author_user_id uuid NOT NULL,
  author_name text,
  body text NOT NULL,
  kind text NOT NULL DEFAULT 'note' CHECK (kind IN ('note','encouragement')),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.item_notes TO authenticated;
GRANT ALL ON public.item_notes TO service_role;

ALTER TABLE public.item_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner full access to item notes"
ON public.item_notes FOR ALL TO authenticated
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Permitted members read item notes"
ON public.item_notes FOR SELECT TO authenticated
USING (public.can_access_item_thread(target_type, target_id));

CREATE POLICY "Permitted members add item notes"
ON public.item_notes FOR INSERT TO authenticated
WITH CHECK (
  author_user_id = auth.uid()
  AND public.can_access_item_thread(target_type, target_id)
);

CREATE POLICY "Members delete own item notes"
ON public.item_notes FOR DELETE TO authenticated
USING (author_user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_item_notes_target ON public.item_notes (target_type, target_id, created_at DESC);

CREATE TRIGGER update_item_notes_updated_at
BEFORE UPDATE ON public.item_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Reminder ladder
CREATE TABLE IF NOT EXISTS public.action_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_id uuid NOT NULL REFERENCES public.extracted_actions(id) ON DELETE CASCADE,
  offset_days integer NOT NULL,
  due_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (action_id, offset_days)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.action_reminders TO authenticated;
GRANT ALL ON public.action_reminders TO service_role;

ALTER TABLE public.action_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own action reminders"
ON public.action_reminders FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_action_reminders_due ON public.action_reminders (due_at) WHERE sent_at IS NULL;

CREATE TRIGGER update_action_reminders_updated_at
BEFORE UPDATE ON public.action_reminders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Cleanup deletes audio only
CREATE OR REPLACE FUNCTION public.cleanup_expired_voice_recordings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.voice_recordings
  SET audio_deleted_at = now()
  WHERE audio_deleted_at IS NULL
    AND expires_at < now()
    AND legal_retention_required = false;

  DELETE FROM public.voice_recordings
  WHERE expires_at < now()
    AND legal_retention_required = false;
END;
$$;