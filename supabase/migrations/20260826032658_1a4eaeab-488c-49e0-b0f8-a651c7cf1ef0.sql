-- 1. Privacy mode on profiles
DO $$ BEGIN
  CREATE TYPE public.privacy_mode AS ENUM ('light_touch', 'balanced', 'full_record');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS privacy_mode public.privacy_mode NOT NULL DEFAULT 'balanced';

-- 2. Traceability + retention columns on meeting_recordings
ALTER TABLE public.meeting_recordings
  ADD COLUMN IF NOT EXISTS reference_code text,
  ADD COLUMN IF NOT EXISTS summary_card jsonb,
  ADD COLUMN IF NOT EXISTS source_state text NOT NULL DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS downloaded_at timestamptz,
  ADD COLUMN IF NOT EXISTS transcript_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS transcript_deleted_at timestamptz;

DO $$ BEGIN
  ALTER TABLE public.meeting_recordings
    ADD CONSTRAINT meeting_recordings_source_state_check
    CHECK (source_state IN ('available', 'downloaded', 'retired'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_meeting_recordings_reference_code
  ON public.meeting_recordings (user_id, reference_code)
  WHERE reference_code IS NOT NULL;

-- 3. Reference code + source quote on extracted_actions
ALTER TABLE public.extracted_actions
  ADD COLUMN IF NOT EXISTS reference_code text,
  ADD COLUMN IF NOT EXISTS source_quote text;

CREATE INDEX IF NOT EXISTS idx_extracted_actions_reference_code
  ON public.extracted_actions (reference_code);

-- 4. Reference code generation
CREATE OR REPLACE FUNCTION public.generate_reference_code(_user_id uuid, _prefix text, _at timestamptz)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base text;
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
BEGIN
  base := _prefix || '-' || to_char(_at AT TIME ZONE 'UTC', 'YYMMDD') || '-';
  FOR i IN 1..40 LOOP
    candidate := base
      || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1)
      || floor(random() * 10)::text;
    IF NOT EXISTS (
      SELECT 1 FROM public.meeting_recordings
      WHERE user_id = _user_id AND reference_code = candidate
    ) THEN
      RETURN candidate;
    END IF;
  END LOOP;
  RETURN base || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);
END;
$$;

CREATE OR REPLACE FUNCTION public.set_meeting_reference_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.reference_code IS NULL THEN
    NEW.reference_code := public.generate_reference_code(
      NEW.user_id, 'MB', COALESCE(NEW.started_at, now())
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_meeting_reference_code ON public.meeting_recordings;
CREATE TRIGGER trg_meeting_reference_code
BEFORE INSERT ON public.meeting_recordings
FOR EACH ROW EXECUTE FUNCTION public.set_meeting_reference_code();

-- Backfill existing captures
UPDATE public.meeting_recordings
SET reference_code = public.generate_reference_code(user_id, 'MB', COALESCE(started_at, created_at))
WHERE reference_code IS NULL;

-- Child steps inherit parent code with an ordinal suffix
CREATE OR REPLACE FUNCTION public.set_action_reference_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  parent_code text;
  next_index int;
BEGIN
  IF NEW.reference_code IS NULL AND NEW.meeting_recording_id IS NOT NULL THEN
    SELECT reference_code INTO parent_code
    FROM public.meeting_recordings WHERE id = NEW.meeting_recording_id;

    IF parent_code IS NOT NULL THEN
      SELECT COALESCE(COUNT(*), 0) + 1 INTO next_index
      FROM public.extracted_actions
      WHERE meeting_recording_id = NEW.meeting_recording_id;

      NEW.reference_code := parent_code || '.' || next_index::text;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_action_reference_code ON public.extracted_actions;
CREATE TRIGGER trg_action_reference_code
BEFORE INSERT ON public.extracted_actions
FOR EACH ROW EXECUTE FUNCTION public.set_action_reference_code();

-- Backfill existing steps
WITH numbered AS (
  SELECT a.id,
         m.reference_code || '.' || ROW_NUMBER() OVER (
           PARTITION BY a.meeting_recording_id ORDER BY a.created_at, a.id
         )::text AS code
  FROM public.extracted_actions a
  JOIN public.meeting_recordings m ON m.id = a.meeting_recording_id
  WHERE a.reference_code IS NULL AND m.reference_code IS NOT NULL
)
UPDATE public.extracted_actions a
SET reference_code = n.code
FROM numbered n
WHERE a.id = n.id;

-- 5. Recording consent
CREATE TABLE IF NOT EXISTS public.recording_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consented_at timestamptz NOT NULL DEFAULT now(),
  privacy_mode public.privacy_mode NOT NULL,
  audio_retention_days integer,
  transcript_retention_days integer,
  consent_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recording_consent TO authenticated;
GRANT ALL ON public.recording_consent TO service_role;

ALTER TABLE public.recording_consent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own recording consent" ON public.recording_consent;
CREATE POLICY "Users manage their own recording consent"
ON public.recording_consent FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS update_recording_consent_updated_at ON public.recording_consent;
CREATE TRIGGER update_recording_consent_updated_at
BEFORE UPDATE ON public.recording_consent
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Retention windows keyed to the user's privacy mode
CREATE OR REPLACE FUNCTION public.retention_days_for_mode(_mode public.privacy_mode, _kind text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN _mode = 'light_touch' THEN CASE WHEN _kind = 'audio' THEN 0 ELSE 7 END
    WHEN _mode = 'full_record' THEN 365
    ELSE 30
  END;
$$;

CREATE OR REPLACE FUNCTION public.apply_retention_to_voice_recording()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mode public.privacy_mode;
BEGIN
  SELECT privacy_mode INTO mode FROM public.profiles WHERE id = NEW.user_id;
  mode := COALESCE(mode, 'balanced');

  NEW.retention_period_days := public.retention_days_for_mode(mode, 'audio');
  NEW.expires_at := COALESCE(NEW.created_at, now())
    + (public.retention_days_for_mode(mode, 'audio') || ' days')::interval;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_voice_recording_retention ON public.voice_recordings;
CREATE TRIGGER trg_voice_recording_retention
BEFORE INSERT ON public.voice_recordings
FOR EACH ROW EXECUTE FUNCTION public.apply_retention_to_voice_recording();

-- 7. Cleanup: purge audio AND transcripts, never summary cards or reference codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_voice_recordings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark audio as gone
  UPDATE public.voice_recordings
  SET audio_deleted_at = now()
  WHERE audio_deleted_at IS NULL
    AND expires_at < now()
    AND legal_retention_required = false;

  -- Purge transcripts on the same schedule; summary_card and reference_code stay
  UPDATE public.meeting_recordings m
  SET transcript = NULL,
      transcript_deleted_at = now(),
      source_state = CASE WHEN m.downloaded_at IS NOT NULL THEN 'downloaded' ELSE 'retired' END
  FROM public.voice_recordings v
  WHERE m.recording_id = v.id
    AND m.transcript_deleted_at IS NULL
    AND v.expires_at < now()
    AND v.legal_retention_required = false;

  UPDATE public.voice_recordings
  SET transcription = NULL
  WHERE transcription IS NOT NULL
    AND expires_at < now()
    AND legal_retention_required = false;

  DELETE FROM public.voice_recordings
  WHERE expires_at < now()
    AND legal_retention_required = false;
END;
$$;