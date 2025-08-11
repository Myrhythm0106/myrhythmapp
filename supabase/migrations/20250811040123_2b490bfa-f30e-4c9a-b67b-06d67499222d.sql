-- Add watchers to meeting recordings
ALTER TABLE meeting_recordings ADD COLUMN watchers UUID[] DEFAULT '{}';

-- Create memory bridge comments table
CREATE TABLE memory_bridge_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meeting_recording_id UUID NOT NULL REFERENCES meeting_recordings(id) ON DELETE CASCADE,
  commenter_member_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for memory bridge comments
ALTER TABLE memory_bridge_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for memory bridge comments
CREATE POLICY "Users can view comments on their recordings" 
ON memory_bridge_comments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Support circle members can comment on recordings" 
ON memory_bridge_comments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM support_circle_members scm 
    WHERE scm.id = commenter_member_id 
    AND scm.status = 'active'
    AND (scm.user_id = auth.uid() OR scm.member_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

CREATE POLICY "Users can update read status of comments" 
ON memory_bridge_comments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create recording usage tracking table for tier limits
CREATE TABLE recording_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recording_count INTEGER NOT NULL DEFAULT 0,
  recording_duration_minutes INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for usage tracking
ALTER TABLE recording_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policy for usage tracking
CREATE POLICY "Users can manage their own usage tracking" 
ON recording_usage_tracking 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for memory bridge comments
CREATE TRIGGER update_memory_bridge_comments_updated_at
BEFORE UPDATE ON memory_bridge_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for usage tracking
CREATE TRIGGER update_recording_usage_tracking_updated_at
BEFORE UPDATE ON recording_usage_tracking
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();