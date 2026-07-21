
-- Extend user_schedule_preferences
ALTER TABLE public.user_schedule_preferences
  ADD COLUMN IF NOT EXISTS brain_healthy_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS min_meeting_gap_minutes integer NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS longer_break_trigger_minutes integer NOT NULL DEFAULT 120,
  ADD COLUMN IF NOT EXISTS longer_break_length_minutes integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS daily_meeting_cap integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS no_daily_cap boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_insert_breaks boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS break_length_minutes integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS break_style text NOT NULL DEFAULT 'quiet_reset',
  ADD COLUMN IF NOT EXISTS break_style_custom_label text,
  ADD COLUMN IF NOT EXISTS reminder_buffer_minutes integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS protected_windows jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS time_blocking_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS time_block_template text NOT NULL DEFAULT 'blank';

-- time_blocks table
CREATE TABLE IF NOT EXISTS public.time_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week integer,           -- 0-6 (Sun..Sat) when recurring weekly
  date date,                     -- specific date override (nullable)
  start_time time NOT NULL,
  end_time time NOT NULL,
  name text NOT NULL,
  block_type text NOT NULL DEFAULT 'focus', -- focus|meetings|admin|rest|personal|custom
  color text NOT NULL DEFAULT 'moss',       -- moss|gold|ember|ink|slate
  meetings_allowed boolean NOT NULL DEFAULT false,
  repeat_rule text NOT NULL DEFAULT 'weekly', -- none|daily|weekdays|weekly|custom
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_blocks TO authenticated;
GRANT ALL ON public.time_blocks TO service_role;

ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own time_blocks"
  ON public.time_blocks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_time_blocks_updated_at
  BEFORE UPDATE ON public.time_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_time_blocks_user_active ON public.time_blocks(user_id, is_active);
