-- Add watchers column to daily_actions table
ALTER TABLE public.daily_actions ADD COLUMN watchers JSONB DEFAULT '[]'::jsonb;