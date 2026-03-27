ALTER TABLE public.user_schedule_preferences
ADD COLUMN IF NOT EXISTS auto_accept_scheduling boolean DEFAULT false;