-- Fix the recording_id constraint to allow null values initially
-- The recording_id will be updated after the voice recording is created
ALTER TABLE meeting_recordings ALTER COLUMN recording_id DROP NOT NULL;