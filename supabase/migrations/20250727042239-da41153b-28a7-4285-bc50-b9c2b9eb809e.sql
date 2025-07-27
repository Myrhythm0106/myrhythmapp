-- Create support circle messaging tables
CREATE TABLE public.support_circle_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sender_member_id UUID REFERENCES public.support_circle_members(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'general',
  related_action_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.support_circle_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for support circle messaging
CREATE POLICY "Users can view messages for themselves" 
ON public.support_circle_messages 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = recipient_user_id);

CREATE POLICY "Support circle members can send messages" 
ON public.support_circle_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.id = sender_member_id 
    AND scm.status = 'active'
    AND (
      scm.user_id = auth.uid() OR 
      scm.member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);

CREATE POLICY "Users can update their own message read status" 
ON public.support_circle_messages 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = recipient_user_id)
WITH CHECK (auth.uid() = user_id OR auth.uid() = recipient_user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_support_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_support_messages_updated_at
BEFORE UPDATE ON public.support_circle_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_support_message_updated_at();

-- Update daily_actions table to store support circle member IDs instead of emails
ALTER TABLE public.daily_actions 
ALTER COLUMN watchers TYPE UUID[] USING ARRAY[]::UUID[];

COMMENT ON COLUMN public.daily_actions.watchers IS 'Array of support_circle_members.id for this action';

-- Create notification function for watcher alerts
CREATE OR REPLACE FUNCTION public.notify_watchers_of_action_completion(
  p_action_id UUID,
  p_user_id UUID,
  p_action_title TEXT,
  p_completion_status TEXT
)
RETURNS UUID AS $$
DECLARE
  alert_id UUID;
  watcher_members UUID[];
BEGIN
  -- Get watchers for this action
  SELECT watchers INTO watcher_members
  FROM public.daily_actions 
  WHERE id = p_action_id AND user_id = p_user_id;
  
  -- Generate alert if there are watchers
  IF array_length(watcher_members, 1) > 0 THEN
    -- Get emails of watcher members
    SELECT public.generate_accountability_alert(
      p_user_id,
      CASE 
        WHEN p_completion_status = 'completed' THEN 'task_completed'
        ELSE 'task_missed'
      END,
      p_action_id,
      CASE 
        WHEN p_completion_status = 'completed' THEN 'Task Completed: ' || p_action_title
        ELSE 'Task Missed: ' || p_action_title
      END,
      CASE 
        WHEN p_completion_status = 'completed' THEN p_action_title || ' has been completed successfully!'
        ELSE p_action_title || ' was not completed as scheduled.'
      END,
      CASE 
        WHEN p_completion_status = 'completed' THEN 'info'
        ELSE 'warning'
      END
    ) INTO alert_id;
  END IF;
  
  RETURN alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;