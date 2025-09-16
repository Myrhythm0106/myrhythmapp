-- Add missing fields to extracted_actions table for comprehensive action format
ALTER TABLE public.extracted_actions 
ADD COLUMN IF NOT EXISTS success_criteria TEXT,
ADD COLUMN IF NOT EXISTS motivation_statement TEXT,
ADD COLUMN IF NOT EXISTS calendar_checked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completion_date DATE,
ADD COLUMN IF NOT EXISTS support_circle_notified BOOLEAN DEFAULT false;

-- Update status default
ALTER TABLE public.extracted_actions 
ALTER COLUMN status SET DEFAULT 'not_started';

-- Add trigger to update calendar_checked when scheduled dates change
CREATE OR REPLACE FUNCTION check_calendar_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset calendar_checked when scheduled date/time changes
  IF (OLD.scheduled_date IS DISTINCT FROM NEW.scheduled_date) OR 
     (OLD.scheduled_time IS DISTINCT FROM NEW.scheduled_time) THEN
    NEW.calendar_checked = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_calendar_availability ON public.extracted_actions;
CREATE TRIGGER trigger_check_calendar_availability
  BEFORE UPDATE ON public.extracted_actions
  FOR EACH ROW
  EXECUTE FUNCTION check_calendar_availability();