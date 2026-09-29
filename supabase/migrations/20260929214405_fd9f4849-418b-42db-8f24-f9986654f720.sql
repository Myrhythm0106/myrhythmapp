ALTER TABLE public.meeting_recordings
  ADD COLUMN IF NOT EXISTS output_mode text NOT NULL DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS transcript_utterances jsonb,
  ADD COLUMN IF NOT EXISTS transcript_original text,
  ADD COLUMN IF NOT EXISTS transcript_edited_at timestamptz,
  ADD COLUMN IF NOT EXISTS speaker_names jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS transcription_quality text;

ALTER TABLE public.meeting_recordings
  DROP CONSTRAINT IF EXISTS meeting_recordings_output_mode_check;
ALTER TABLE public.meeting_recordings
  ADD CONSTRAINT meeting_recordings_output_mode_check
  CHECK (output_mode IN ('none','transcript','actions','both'));