-- Create conversation_contexts table for Memory Bridge
CREATE TABLE public.conversation_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  participant_name TEXT NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'other',
  last_conversation_date DATE,
  conversation_history JSONB NOT NULL DEFAULT '[]',
  relationship_dynamics TEXT,
  emotional_patterns JSONB NOT NULL DEFAULT '{}',
  important_topics TEXT[] NOT NULL DEFAULT '{}',
  communication_preferences TEXT,
  energy_compatibility INTEGER DEFAULT 5,
  conflict_resolution_style TEXT,
  shared_commitments JSONB NOT NULL DEFAULT '[]',
  memory_triggers TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT conversation_contexts_relationship_type_check 
    CHECK (relationship_type IN ('spouse', 'child', 'parent', 'friend', 'colleague', 'healthcare', 'other'))
);

-- Enable RLS
ALTER TABLE public.conversation_contexts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own conversation contexts" 
ON public.conversation_contexts 
FOR ALL 
USING (auth.uid() = user_id);