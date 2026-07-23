ALTER TABLE public.assessment_results
  ADD COLUMN IF NOT EXISTS event_recency text,
  ADD COLUMN IF NOT EXISTS freeform_notes jsonb NOT NULL DEFAULT '{}'::jsonb;