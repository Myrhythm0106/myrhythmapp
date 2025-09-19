-- Create calendar shares table for collaborative calendar sharing
CREATE TABLE public.calendar_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  shared_with_email TEXT NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('view', 'edit', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  creator_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event invitations table for RSVP functionality
CREATE TABLE public.event_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invitee_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  response_date TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  message TEXT,
  inviter_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event reminders table for enhanced reminder system
CREATE TABLE public.event_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reminder_time TEXT NOT NULL, -- e.g., '7_days', '2_hours', '30_minutes'
  reminder_methods TEXT[] DEFAULT ARRAY['push'], -- 'push', 'email', 'sms'
  is_active BOOLEAN NOT NULL DEFAULT true,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.calendar_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_shares
CREATE POLICY "Users can create calendar shares for their events"
ON public.calendar_shares FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = calendar_event_id AND ce.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view shares for their events or where they are shared with"
ON public.calendar_shares FOR SELECT
USING (
  creator_id = auth.uid() OR
  shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = calendar_event_id AND ce.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update shares for their events"
ON public.calendar_shares FOR UPDATE
USING (
  creator_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = calendar_event_id AND ce.user_id = auth.uid()
  )
);

-- RLS Policies for event_invitations
CREATE POLICY "Users can create invitations for their events"
ON public.event_invitations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = event_id AND ce.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view invitations for their events or where they are invited"
ON public.event_invitations FOR SELECT
USING (
  inviter_id = auth.uid() OR
  invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = event_id AND ce.user_id = auth.uid()
  )
);

CREATE POLICY "Invitees can update their invitation responses"
ON public.event_invitations FOR UPDATE
USING (
  invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
)
WITH CHECK (
  invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- RLS Policies for event_reminders
CREATE POLICY "Users can manage their own event reminders"
ON public.event_reminders FOR ALL
USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_calendar_shares_event_id ON public.calendar_shares(calendar_event_id);
CREATE INDEX idx_calendar_shares_email ON public.calendar_shares(shared_with_email);
CREATE INDEX idx_event_invitations_event_id ON public.event_invitations(event_id);
CREATE INDEX idx_event_invitations_email ON public.event_invitations(invitee_email);
CREATE INDEX idx_event_reminders_event_id ON public.event_reminders(event_id);
CREATE INDEX idx_event_reminders_user_id ON public.event_reminders(user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_calendar_shares_updated_at
  BEFORE UPDATE ON public.calendar_shares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_invitations_updated_at
  BEFORE UPDATE ON public.event_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_reminders_updated_at
  BEFORE UPDATE ON public.event_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for collaborative features
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_shares;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_invitations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_reminders;