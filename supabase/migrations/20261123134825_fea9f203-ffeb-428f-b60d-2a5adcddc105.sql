ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS reminder_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS snoozed_until timestamptz,
  ADD COLUMN IF NOT EXISTS prep_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS due_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS followup_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS responded_at timestamptz;