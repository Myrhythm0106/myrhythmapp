ALTER TABLE public.user_schedule_preferences
  ADD COLUMN IF NOT EXISTS pomodoro_preset text NOT NULL DEFAULT 'classic_pomodoro';