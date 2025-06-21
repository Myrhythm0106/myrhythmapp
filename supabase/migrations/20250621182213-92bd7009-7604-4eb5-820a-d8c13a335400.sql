
-- Create voice_recordings table for persistent storage
CREATE TABLE public.voice_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  duration_seconds INTEGER,
  transcription TEXT,
  transcription_confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  access_level TEXT NOT NULL DEFAULT 'private',
  metadata JSONB DEFAULT '{}',
  legal_retention_required BOOLEAN DEFAULT false,
  retention_period_days INTEGER DEFAULT 365
);

-- Enable RLS
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;

-- User can view their own recordings
CREATE POLICY "Users can view their own voice recordings"
  ON public.voice_recordings
  FOR SELECT
  USING (auth.uid() = user_id);

-- User can create their own recordings
CREATE POLICY "Users can create their own voice recordings"
  ON public.voice_recordings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User can update their own recordings
CREATE POLICY "Users can update their own voice recordings"
  ON public.voice_recordings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- User can delete their own recordings (unless legally required to retain)
CREATE POLICY "Users can delete their own voice recordings"
  ON public.voice_recordings
  FOR DELETE
  USING (auth.uid() = user_id AND legal_retention_required = false);

-- Health professionals can view recordings they have access to
CREATE POLICY "Health professionals can view accessible recordings"
  ON public.voice_recordings
  FOR SELECT
  USING (
    access_level = 'healthcare' AND
    EXISTS (
      SELECT 1 FROM public.support_circle_members scm
      WHERE scm.user_id = voice_recordings.user_id
      AND scm.role = 'medical'
      AND scm.status = 'active'
      AND (scm.permissions->>'voice_recordings')::boolean = true
    )
  );

-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('voice-recordings', 'voice-recordings', false);

-- Storage policies for voice recordings
CREATE POLICY "Users can upload their own voice recordings"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'voice-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own voice recordings"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'voice-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own voice recordings"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'voice-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Health professionals can access voice recordings they have permission for
CREATE POLICY "Health professionals can access voice recordings"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'voice-recordings' AND
    EXISTS (
      SELECT 1 FROM public.support_circle_members scm
      WHERE scm.user_id::text = (storage.foldername(name))[1]
      AND scm.role = 'medical'
      AND scm.status = 'active'
      AND (scm.permissions->>'voice_recordings')::boolean = true
    )
  );

-- Function to clean up expired recordings (for legal compliance)
CREATE OR REPLACE FUNCTION public.cleanup_expired_voice_recordings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired recordings that are not legally required to be retained
  DELETE FROM public.voice_recordings
  WHERE expires_at < now()
  AND legal_retention_required = false;
  
  -- Update retention status for recordings past their retention period
  UPDATE public.voice_recordings
  SET metadata = metadata || jsonb_build_object('retention_expired', true)
  WHERE created_at + INTERVAL '1 day' * retention_period_days < now()
  AND legal_retention_required = true
  AND NOT (metadata->>'retention_expired')::boolean;
END;
$$;
