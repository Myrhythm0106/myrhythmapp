-- Add missing fields to extracted_actions table for comprehensive action format
ALTER TABLE public.extracted_actions 
ADD COLUMN success_criteria TEXT,
ADD COLUMN motivation_statement TEXT,
ADD COLUMN calendar_checked BOOLEAN DEFAULT false,
ADD COLUMN completion_date DATE,
ADD COLUMN support_circle_notified BOOLEAN DEFAULT false;

-- Update status enum to include more granular options
ALTER TABLE public.extracted_actions 
ALTER COLUMN status SET DEFAULT 'not_started';

-- Add index for better performance on status queries
CREATE INDEX idx_extracted_actions_status ON public.extracted_actions(status);
CREATE INDEX idx_extracted_actions_completion_date ON public.extracted_actions(completion_date);

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

CREATE TRIGGER trigger_check_calendar_availability
  BEFORE UPDATE ON public.extracted_actions
  FOR EACH ROW
  EXECUTE FUNCTION check_calendar_availability();