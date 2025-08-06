-- Add watchers field to calendar_events table
ALTER TABLE calendar_events ADD COLUMN watchers text[] DEFAULT NULL;

-- Create index for better performance on watchers queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_watchers ON calendar_events USING GIN(watchers);