-- Add transcript and processing completion tracking to meeting_recordings table
ALTER TABLE public.meeting_recordings 
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS processing_completed_at TIMESTAMP WITH TIME ZONE;

-- Update the processing status in existing records to ensure consistency
UPDATE public.meeting_recordings 
SET processing_status = 'pending' 
WHERE processing_status IS NULL;