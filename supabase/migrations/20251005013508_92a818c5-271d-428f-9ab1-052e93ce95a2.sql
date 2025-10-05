-- Week 1: Add validation columns to extracted_actions table
ALTER TABLE public.extracted_actions
ADD COLUMN extraction_method TEXT DEFAULT 'rule-based' CHECK (extraction_method IN ('openai', 'rule-based', 'manual')),
ADD COLUMN validation_score INTEGER DEFAULT 0 CHECK (validation_score >= 0 AND validation_score <= 100),
ADD COLUMN validation_issues JSONB DEFAULT '[]'::jsonb,
ADD COLUMN requires_review BOOLEAN DEFAULT false;

-- Add index for review queue performance
CREATE INDEX idx_extracted_actions_requires_review ON public.extracted_actions(user_id, requires_review) WHERE requires_review = true;

-- Add index for extraction method analytics
CREATE INDEX idx_extracted_actions_extraction_method ON public.extracted_actions(extraction_method, created_at);