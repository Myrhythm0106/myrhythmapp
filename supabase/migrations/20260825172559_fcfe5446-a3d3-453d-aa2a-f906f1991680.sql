ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS extracted_action_id uuid REFERENCES public.extracted_actions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_calendar_events_extracted_action
  ON public.calendar_events (extracted_action_id);