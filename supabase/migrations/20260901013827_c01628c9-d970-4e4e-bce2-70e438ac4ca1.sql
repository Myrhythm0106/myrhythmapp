ALTER TABLE public.user_schedule_preferences
  ADD COLUMN IF NOT EXISTS best_window_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS best_window_start time NOT NULL DEFAULT '09:00',
  ADD COLUMN IF NOT EXISTS best_window_end time NOT NULL DEFAULT '11:30',
  ADD COLUMN IF NOT EXISTS focus_block_minutes integer NOT NULL DEFAULT 45,
  ADD COLUMN IF NOT EXISTS priority_levels_by_type jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS learned_adjustments jsonb NOT NULL DEFAULT '{}'::jsonb;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_schedule_preferences TO authenticated;
GRANT ALL ON public.user_schedule_preferences TO service_role;