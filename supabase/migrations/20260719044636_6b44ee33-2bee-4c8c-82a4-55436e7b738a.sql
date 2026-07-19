ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS google_event_id text,
  ADD COLUMN IF NOT EXISTS outlook_event_id text,
  ADD COLUMN IF NOT EXISTS pushed_to_google_at timestamptz,
  ADD COLUMN IF NOT EXISTS pushed_to_outlook_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_push_error text;