ALTER TABLE public.voice_recordings
  ADD COLUMN IF NOT EXISTS keep_transcript boolean NOT NULL DEFAULT false;

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

  -- 2. Purge transcripts on their own schedule — unless the person chose to
  --    keep the full transcript (like their Next Steps, it then stays).
  UPDATE public.meeting_recordings m
  SET transcript = NULL,
      transcript_deleted_at = now(),
      source_state = CASE WHEN m.downloaded_at IS NOT NULL THEN 'downloaded' ELSE 'retired' END
  FROM public.voice_recordings v
  WHERE m.recording_id = v.id
    AND m.transcript_deleted_at IS NULL
    AND v.expires_at < now()
    AND v.keep_transcript = false
    AND v.legal_retention_required = false;

  UPDATE public.voice_recordings
  SET transcription = NULL
  WHERE transcription IS NOT NULL
    AND expires_at < now()
    AND keep_transcript = false
    AND legal_retention_required = false;

  DELETE FROM public.voice_recordings
  WHERE expires_at < now()
    AND keep_transcript = false
    AND legal_retention_required = false;
END;
$function$;