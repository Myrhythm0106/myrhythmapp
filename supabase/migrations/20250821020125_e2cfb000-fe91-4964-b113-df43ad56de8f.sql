-- Create voice_recordings table for audio file storage
CREATE TABLE IF NOT EXISTS public.voice_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  duration_seconds INTEGER,
  transcription TEXT,
  transcription_confidence DECIMAL,
  access_level TEXT NOT NULL DEFAULT 'private',
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  legal_retention_required BOOLEAN DEFAULT false,
  retention_period_days INTEGER DEFAULT 365,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meeting_recordings table
CREATE TABLE IF NOT EXISTS public.meeting_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recording_id UUID REFERENCES public.voice_recordings(id),
  meeting_title TEXT NOT NULL,
  participants JSONB NOT NULL DEFAULT '[]',
  meeting_context TEXT,
  meeting_type TEXT NOT NULL DEFAULT 'informal',
  location TEXT,
  energy_level INTEGER,
  emotional_context TEXT,
  relationship_context JSONB DEFAULT '{}',
  watchers UUID[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create extracted_actions table
CREATE TABLE IF NOT EXISTS public.extracted_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meeting_recording_id UUID NOT NULL REFERENCES public.meeting_recordings(id),
  action_text TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'commitment',
  assigned_to TEXT,
  due_context TEXT,
  priority_level INTEGER DEFAULT 3,
  confidence_score DECIMAL,
  relationship_impact TEXT,
  emotional_stakes TEXT,
  intent_behind TEXT,
  transcript_excerpt TEXT,
  timestamp_in_recording INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  user_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create action_confirmations table
CREATE TABLE IF NOT EXISTS public.action_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  extracted_action_id UUID NOT NULL REFERENCES public.extracted_actions(id),
  confirmation_status TEXT NOT NULL,
  user_modifications JSONB DEFAULT '{}',
  confirmation_note TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recording_usage_tracking table
CREATE TABLE IF NOT EXISTS public.recording_usage_tracking (
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

-- Enable RLS on all tables
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recording_usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voice_recordings
CREATE POLICY "Users can create their own voice recordings" 
ON public.voice_recordings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own voice recordings" 
ON public.voice_recordings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice recordings" 
ON public.voice_recordings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice recordings" 
ON public.voice_recordings FOR DELETE 
USING (auth.uid() = user_id AND legal_retention_required = false);

-- RLS Policies for meeting_recordings
CREATE POLICY "Users can manage their own meeting recordings" 
ON public.meeting_recordings FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for extracted_actions
CREATE POLICY "Users can manage their own extracted actions" 
ON public.extracted_actions FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for action_confirmations
CREATE POLICY "Users can manage their own action confirmations" 
ON public.action_confirmations FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for recording_usage_tracking
CREATE POLICY "Users can manage their own usage tracking" 
ON public.recording_usage_tracking FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_voice_recordings_user_id ON public.voice_recordings(user_id);
CREATE INDEX idx_meeting_recordings_user_id ON public.meeting_recordings(user_id);
CREATE INDEX idx_extracted_actions_user_id ON public.extracted_actions(user_id);
CREATE INDEX idx_extracted_actions_meeting_id ON public.extracted_actions(meeting_recording_id);
CREATE INDEX idx_action_confirmations_user_id ON public.action_confirmations(user_id);
CREATE INDEX idx_recording_usage_user_id ON public.recording_usage_tracking(user_id);

-- Create update triggers
CREATE TRIGGER update_voice_recordings_updated_at
  BEFORE UPDATE ON public.voice_recordings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meeting_recordings_updated_at
  BEFORE UPDATE ON public.meeting_recordings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_meeting_updated_at_column();

CREATE TRIGGER update_extracted_actions_updated_at
  BEFORE UPDATE ON public.extracted_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();