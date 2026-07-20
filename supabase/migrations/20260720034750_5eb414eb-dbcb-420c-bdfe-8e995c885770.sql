ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS reminder_level text NOT NULL DEFAULT 'steady',
  ADD COLUMN IF NOT EXISTS reminder_offsets_minutes int[] NOT NULL DEFAULT ARRAY[1440,30]::int[];

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'calendar_events_reminder_level_check') THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_reminder_level_check
      CHECK (reminder_level IN ('gentle','steady','strong','custom','off'));
  END IF;
END $$;