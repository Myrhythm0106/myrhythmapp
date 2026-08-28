ALTER TABLE public.extracted_actions
  ADD COLUMN IF NOT EXISTS accountable jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS consulted jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS informed jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS raci_notified_at timestamp with time zone DEFAULT NULL;