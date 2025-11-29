-- Add AI summary columns to voice_recordings table
ALTER TABLE public.voice_recordings 
ADD COLUMN IF NOT EXISTS ai_summary text,
ADD COLUMN IF NOT EXISTS key_insights jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS extracted_actions_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_at timestamp with time zone;

-- Create index for faster queries on processing status
CREATE INDEX IF NOT EXISTS idx_voice_recordings_processing_status 
ON public.voice_recordings(processing_status);

-- Add comment for documentation
COMMENT ON COLUMN public.voice_recordings.ai_summary IS 'AI-generated summary with key takeaways and insights';
COMMENT ON COLUMN public.voice_recordings.key_insights IS 'Structured array of insights extracted by AI';
COMMENT ON COLUMN public.voice_recordings.extracted_actions_count IS 'Number of ACTs extracted from this recording';
COMMENT ON COLUMN public.voice_recordings.processing_status IS 'Status: pending, processing, completed, failed';