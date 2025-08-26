-- Add processing status columns to meeting_recordings
ALTER TABLE public.meeting_recordings 
ADD COLUMN processing_status text DEFAULT 'pending',
ADD COLUMN processing_error text,
ADD COLUMN proposed_schedule jsonb DEFAULT '[]'::jsonb;

-- Create user_schedule_preferences table for optimal timing
CREATE TABLE public.user_schedule_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preference_type text NOT NULL, -- 'most_productive', 'least_productive', 'preferred_meeting_times'
  time_slots jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{"start": "09:00", "end": "11:00", "days": [1,2,3,4,5]}]
  energy_level integer, -- 1-10 scale
  notes text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_schedule_preferences
ALTER TABLE public.user_schedule_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_schedule_preferences
CREATE POLICY "Users can manage their own schedule preferences" 
ON public.user_schedule_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Add schedule-related columns to extracted_actions
ALTER TABLE public.extracted_actions
ADD COLUMN proposed_date date,
ADD COLUMN proposed_time time,
ADD COLUMN scheduled_date date,
ADD COLUMN scheduled_time time,
ADD COLUMN calendar_event_id uuid,
ADD COLUMN assigned_watchers uuid[] DEFAULT '{}';

-- Create trigger for updated_at on user_schedule_preferences
CREATE TRIGGER update_user_schedule_preferences_updated_at
BEFORE UPDATE ON public.user_schedule_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();