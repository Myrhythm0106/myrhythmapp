
CREATE TABLE public.document_import_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meeting_id UUID,
  file_path TEXT,
  file_name TEXT,
  actions_sent_count INTEGER NOT NULL DEFAULT 0,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  deletion_status TEXT NOT NULL DEFAULT 'pending',
  deletion_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.document_import_audit TO authenticated;
GRANT ALL ON public.document_import_audit TO service_role;

ALTER TABLE public.document_import_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit rows"
  ON public.document_import_audit FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audit rows"
  ON public.document_import_audit FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audit rows"
  ON public.document_import_audit FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_document_import_audit_user ON public.document_import_audit(user_id, approved_at DESC);
