ALTER TABLE public.voice_recordings
  ADD COLUMN IF NOT EXISTS audio_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS audio_hold_count integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS voice_recordings_audio_expires_idx
  ON public.voice_recordings (audio_expires_at)
  WHERE audio_deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.retention_days_for_mode(_mode privacy_mode, _kind text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $function$
  SELECT CASE
    WHEN _mode::text = 'writeup_only' THEN CASE WHEN _kind = 'audio' THEN 3 ELSE 3650 END
    WHEN _mode::text = 'light_touch' THEN CASE WHEN _kind = 'audio' THEN 0 ELSE 7 END
    WHEN _mode::text = 'full_record' THEN 365
    ELSE 30
  END;
$function$;

CREATE OR REPLACE FUNCTION public.apply_retention_to_voice_recording()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  mode public.privacy_mode;
  base timestamptz;
BEGIN
  SELECT privacy_mode INTO mode FROM public.profiles WHERE id = NEW.user_id;
  mode := COALESCE(mode, 'balanced');
  base := COALESCE(NEW.created_at, now());

  NEW.retention_period_days := public.retention_days_for_mode(mode, 'audio');
  NEW.audio_expires_at := base
    + (public.retention_days_for_mode(mode, 'audio') || ' days')::interval;
  NEW.expires_at := base
    + (public.retention_days_for_mode(mode, 'transcript') || ' days')::interval;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_voice_recordings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- 1. Remove the audio file itself once its own clock has run out.
  DELETE FROM storage.objects o
  USING public.voice_recordings v
  WHERE o.bucket_id = 'voice-recordings'
    AND o.name = v.file_path
    AND v.audio_deleted_at IS NULL
    AND v.audio_expires_at IS NOT NULL
    AND v.audio_expires_at < now()
    AND v.legal_retention_required = false;

  UPDATE public.voice_recordings
  SET audio_deleted_at = now()
  WHERE audio_deleted_at IS NULL
    AND audio_expires_at IS NOT NULL
    AND audio_expires_at < now()
    AND legal_retention_required = false;

  -- 2. Purge transcripts on their own schedule; summary card + reference code stay.
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
$function$;

-- Existing rows: give them an audio clock matching their current record clock.
UPDATE public.voice_recordings
SET audio_expires_at = expires_at
WHERE audio_expires_at IS NULL AND audio_deleted_at IS NULL;