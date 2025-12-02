-- Add contextual columns to event_reminders table
ALTER TABLE public.event_reminders 
ADD COLUMN IF NOT EXISTS original_motivation TEXT,
ADD COLUMN IF NOT EXISTS location_context TEXT,
ADD COLUMN IF NOT EXISTS success_visual_url TEXT,
ADD COLUMN IF NOT EXISTS pre_reminder_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS confirmation_received BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS escalation_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS benefit_message TEXT,
ADD COLUMN IF NOT EXISTS who_benefits TEXT;

-- Create reminder_streaks table for tracking consistency
CREATE TABLE IF NOT EXISTS public.reminder_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reminder_type TEXT NOT NULL DEFAULT 'general',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  total_completions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reminder_type)
);

-- Enable RLS on reminder_streaks
ALTER TABLE public.reminder_streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminder_streaks
CREATE POLICY "Users can manage their own reminder streaks"
ON public.reminder_streaks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_reminder_streaks_updated_at
BEFORE UPDATE ON public.reminder_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();