
-- 1. Track where each extracted action came from
ALTER TABLE public.extracted_actions
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'voice';

-- 2. RLS policies on the private document-imports bucket
--    (bucket was created via the storage tool; we only add per-user object policies)

CREATE POLICY "document-imports: users read own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'document-imports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "document-imports: users upload own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'document-imports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "document-imports: users update own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'document-imports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "document-imports: users delete own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'document-imports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
