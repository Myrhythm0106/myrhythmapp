
ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS recurrence_pattern text NOT NULL DEFAULT 'none'
    CHECK (recurrence_pattern IN ('none','daily','weekly','fortnightly','monthly','yearly','weekdays','custom')),
  ADD COLUMN IF NOT EXISTS recurrence_interval integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS recurrence_end_date date;
