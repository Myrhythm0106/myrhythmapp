-- Create calendar integrations table for external calendar sync
CREATE TABLE public.calendar_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
  account_email TEXT NOT NULL,
  account_name TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sync_enabled BOOLEAN NOT NULL DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider, account_email)
);

-- Create external calendar events table
CREATE TABLE public.external_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.calendar_integrations(id) ON DELETE CASCADE,
  external_event_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  end_time TIME,
  timezone TEXT DEFAULT 'UTC',
  location TEXT,
  source TEXT NOT NULL CHECK (source IN ('google', 'outlook', 'apple')),
  is_all_day BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'tentative', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(integration_id, external_event_id)
);

-- Enable RLS
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for calendar_integrations
CREATE POLICY "Users can view their own calendar integrations" 
ON public.calendar_integrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar integrations" 
ON public.calendar_integrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar integrations" 
ON public.calendar_integrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar integrations" 
ON public.calendar_integrations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for external_calendar_events
CREATE POLICY "Users can view their own external calendar events" 
ON public.external_calendar_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own external calendar events" 
ON public.external_calendar_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own external calendar events" 
ON public.external_calendar_events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own external calendar events" 
ON public.external_calendar_events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for timestamp updates
CREATE TRIGGER update_calendar_integrations_updated_at
BEFORE UPDATE ON public.calendar_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_calendar_events_updated_at
BEFORE UPDATE ON public.external_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_calendar_integrations_user_id ON public.calendar_integrations(user_id);
CREATE INDEX idx_calendar_integrations_provider ON public.calendar_integrations(provider);
CREATE INDEX idx_external_calendar_events_user_id ON public.external_calendar_events(user_id);
CREATE INDEX idx_external_calendar_events_date ON public.external_calendar_events(date);
CREATE INDEX idx_external_calendar_events_integration_id ON public.external_calendar_events(integration_id);