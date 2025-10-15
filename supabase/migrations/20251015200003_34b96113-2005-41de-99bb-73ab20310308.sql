-- Add daily tracking columns to recording_usage_tracking table
ALTER TABLE recording_usage_tracking 
ADD COLUMN IF NOT EXISTS daily_duration_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_recording_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS daily_limit_reached_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster daily queries
CREATE INDEX IF NOT EXISTS idx_recording_usage_daily 
ON recording_usage_tracking(user_id, last_recording_date);

COMMENT ON COLUMN recording_usage_tracking.daily_duration_minutes IS 'Total minutes recorded today (resets daily)';
COMMENT ON COLUMN recording_usage_tracking.last_recording_date IS 'Date of last recording (used to detect day changes)';
COMMENT ON COLUMN recording_usage_tracking.daily_limit_reached_at IS 'Timestamp when daily limit was reached (for analytics)';