-- Create transcription_jobs table for async audio processing
CREATE TABLE public.transcription_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meeting_id UUID NOT NULL,
  recording_id UUID NOT NULL,
  provider TEXT NOT NULL DEFAULT 'assemblyai',
  job_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  error_message TEXT,
  transcript_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.transcription_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transcription jobs" 
ON public.transcription_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transcription_jobs_updated_at
BEFORE UPDATE ON public.transcription_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();