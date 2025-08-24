-- Storage policies to enable user access to their own voice recordings
-- Using conditional creation to avoid duplicates
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can view their own voice recordings files'
  ) THEN
    CREATE POLICY "Users can view their own voice recordings files"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'voice-recordings'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can upload their own voice recordings files'
  ) THEN
    CREATE POLICY "Users can upload their own voice recordings files"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'voice-recordings'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can update their own voice recordings files'
  ) THEN
    CREATE POLICY "Users can update their own voice recordings files"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'voice-recordings'
      AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
      bucket_id = 'voice-recordings'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can delete their own voice recordings files'
  ) THEN
    CREATE POLICY "Users can delete their own voice recordings files"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'voice-recordings'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;