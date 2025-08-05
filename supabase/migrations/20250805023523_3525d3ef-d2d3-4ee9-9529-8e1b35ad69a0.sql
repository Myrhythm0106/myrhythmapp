-- Fix storage RLS policies for voice recordings to allow signed URL creation
CREATE POLICY "Enable signed URL creation for voice recordings" ON storage.objects
FOR SELECT
USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Also allow users to create signed URLs for their own voice recordings
CREATE POLICY "Allow signed URL creation for own voice recordings" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);