-- Create analytics_events table for internal tracking
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT
);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting events (anyone can insert for analytics)
CREATE POLICY "allow_insert_analytics" ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Create policy for reading own events
CREATE POLICY "select_own_analytics" ON public.analytics_events
FOR SELECT
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create index for better performance
CREATE INDEX idx_analytics_events_type_created ON public.analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_events_user_created ON public.analytics_events(user_id, created_at);