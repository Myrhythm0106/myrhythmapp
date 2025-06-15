
-- Create accountability_reminders table for family-initiated reminders
CREATE TABLE public.accountability_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_by_member_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reminder_type TEXT NOT NULL DEFAULT 'custom', -- 'medication', 'appointment', 'activity', 'custom'
  frequency TEXT NOT NULL DEFAULT 'once', -- 'once', 'daily', 'weekly', 'monthly'
  reminder_time TIME NOT NULL,
  reminder_days INTEGER[] DEFAULT NULL, -- [0,1,2,3,4,5,6] for days of week, null for daily
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  escalation_enabled BOOLEAN NOT NULL DEFAULT false,
  escalation_delay_minutes INTEGER DEFAULT 30,
  escalation_members TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create accountability_alerts table for real-time progress notifications
CREATE TABLE public.accountability_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL, -- 'task_completed', 'task_missed', 'streak_milestone', 'concern_pattern'
  related_id UUID DEFAULT NULL, -- reference to task, goal, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'urgent'
  target_members TEXT[] NOT NULL DEFAULT '{}', -- member IDs who should receive this alert
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  acknowledged_by TEXT[] DEFAULT '{}', -- member IDs who have acknowledged
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_circle_members table to track community members with permissions
CREATE TABLE public.support_circle_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- the person being supported
  member_name TEXT NOT NULL,
  member_email TEXT DEFAULT NULL,
  member_phone TEXT DEFAULT NULL,
  relationship TEXT NOT NULL, -- 'family', 'friend', 'caregiver', 'healthcare', 'colleague'
  role TEXT NOT NULL DEFAULT 'viewer', -- 'viewer', 'supporter', 'caregiver', 'medical'
  permissions JSONB NOT NULL DEFAULT '{}', -- {"mood": true, "health": false, "calendar": true, etc.}
  can_send_reminders BOOLEAN NOT NULL DEFAULT false,
  can_receive_alerts BOOLEAN NOT NULL DEFAULT true,
  notification_preferences JSONB NOT NULL DEFAULT '{"email": true, "sms": false}',
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'pending', 'inactive'
  invitation_token TEXT DEFAULT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reminder_responses table to track user responses to reminders
CREATE TABLE public.reminder_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id UUID NOT NULL REFERENCES public.accountability_reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  response_type TEXT DEFAULT NULL, -- 'completed', 'snoozed', 'dismissed', 'escalated'
  response_note TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.accountability_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountability_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accountability_reminders
CREATE POLICY "Users can view reminders for themselves" 
  ON public.accountability_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Support members can create reminders" 
  ON public.accountability_reminders 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_circle_members 
      WHERE user_id = accountability_reminders.user_id 
      AND member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND can_send_reminders = true
      AND status = 'active'
    )
  );

-- RLS Policies for accountability_alerts
CREATE POLICY "Users can view their own alerts" 
  ON public.accountability_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create alerts" 
  ON public.accountability_alerts 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for support_circle_members
CREATE POLICY "Users can view their support circle" 
  ON public.support_circle_members 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their support circle" 
  ON public.support_circle_members 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for reminder_responses
CREATE POLICY "Users can view their reminder responses" 
  ON public.reminder_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reminder responses" 
  ON public.reminder_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to generate accountability alerts
CREATE OR REPLACE FUNCTION public.generate_accountability_alert(
  p_user_id UUID,
  p_alert_type TEXT,
  p_related_id UUID DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  alert_id UUID;
  target_members TEXT[];
BEGIN
  -- Get relevant support circle members based on alert type
  SELECT ARRAY_AGG(DISTINCT 
    CASE 
      WHEN member_email IS NOT NULL THEN member_email
      ELSE member_name 
    END
  )
  INTO target_members
  FROM public.support_circle_members 
  WHERE user_id = p_user_id 
  AND status = 'active'
  AND can_receive_alerts = true
  AND (
    (p_alert_type = 'task_completed' AND (permissions->>'calendar')::boolean = true) OR
    (p_alert_type = 'task_missed' AND (permissions->>'calendar')::boolean = true) OR
    (p_alert_type = 'streak_milestone' AND (permissions->>'goals')::boolean = true) OR
    (p_alert_type = 'concern_pattern' AND role = 'medical')
  );

  -- Insert the alert
  INSERT INTO public.accountability_alerts (
    user_id, alert_type, related_id, title, message, severity, target_members
  ) VALUES (
    p_user_id, p_alert_type, p_related_id, 
    COALESCE(p_title, 'Progress Update'), 
    COALESCE(p_message, 'New activity update available'),
    p_severity, 
    COALESCE(target_members, '{}')
  ) RETURNING id INTO alert_id;

  RETURN alert_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_accountability_reminders_user_active ON public.accountability_reminders(user_id, is_active);
CREATE INDEX idx_accountability_alerts_user_type ON public.accountability_alerts(user_id, alert_type);
CREATE INDEX idx_support_circle_members_user_status ON public.support_circle_members(user_id, status);
CREATE INDEX idx_reminder_responses_reminder_sent ON public.reminder_responses(reminder_id, sent_at);
