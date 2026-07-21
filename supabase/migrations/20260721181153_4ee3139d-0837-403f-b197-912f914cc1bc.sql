ALTER TABLE public.extracted_actions
  ADD COLUMN IF NOT EXISTS adhoc_loop_ins jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.extracted_actions.adhoc_loop_ins IS
  'Per-action ad-hoc people to notify without adding them to the Support Circle. Array of { name, email }.';