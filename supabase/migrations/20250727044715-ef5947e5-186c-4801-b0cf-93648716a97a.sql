-- Add decision-specific fields to notes table for Decision Logging feature
ALTER TABLE public.notes 
ADD COLUMN decision_type text,
ADD COLUMN decision_context text,
ADD COLUMN decision_outcome text,
ADD COLUMN reflection_date date,
ADD COLUMN decision_tags text[] DEFAULT '{}',
ADD COLUMN is_decision boolean DEFAULT false;

-- Create index for decision queries
CREATE INDEX idx_notes_decisions ON public.notes (user_id, is_decision) WHERE is_decision = true;