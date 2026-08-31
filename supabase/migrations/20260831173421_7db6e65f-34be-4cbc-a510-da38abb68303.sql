ALTER TABLE public.user_schedule_preferences
  ADD COLUMN IF NOT EXISTS capture_prompt_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_finish_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS quiet_finish_minutes integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS companion_capture_enabled boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.validate_capture_preferences()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.quiet_finish_minutes NOT IN (5, 10, 20) THEN
    RAISE EXCEPTION 'quiet_finish_minutes must be 5, 10, or 20';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_capture_preferences_trigger ON public.user_schedule_preferences;
CREATE TRIGGER validate_capture_preferences_trigger
  BEFORE INSERT OR UPDATE OF quiet_finish_minutes ON public.user_schedule_preferences
  FOR EACH ROW EXECUTE FUNCTION public.validate_capture_preferences();