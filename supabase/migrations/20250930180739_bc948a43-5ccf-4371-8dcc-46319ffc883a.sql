-- Add enhanced action reliability fields to extracted_actions table

-- Add momentum and follow-through fields
ALTER TABLE public.extracted_actions
ADD COLUMN IF NOT EXISTS momentum_builder TEXT,
ADD COLUMN IF NOT EXISTS two_minute_starter TEXT,
ADD COLUMN IF NOT EXISTS celebration_trigger TEXT,
ADD COLUMN IF NOT EXISTS potential_barriers TEXT[],
ADD COLUMN IF NOT EXISTS if_stuck TEXT,
ADD COLUMN IF NOT EXISTS best_time TEXT,
ADD COLUMN IF NOT EXISTS next_natural_steps TEXT[],
ADD COLUMN IF NOT EXISTS detail_level TEXT DEFAULT 'standard' CHECK (detail_level IN ('minimal', 'standard', 'complete')),
ADD COLUMN IF NOT EXISTS alternative_phrasings JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS completion_criteria_specific TEXT,
ADD COLUMN IF NOT EXISTS verb_category TEXT;

-- Add comment explaining the new fields
COMMENT ON COLUMN public.extracted_actions.momentum_builder IS 'Motivational prompt to help user take action immediately';
COMMENT ON COLUMN public.extracted_actions.two_minute_starter IS 'Ultra-simple 2-minute first step to reduce friction';
COMMENT ON COLUMN public.extracted_actions.celebration_trigger IS 'What to do when action is complete to celebrate the win';
COMMENT ON COLUMN public.extracted_actions.potential_barriers IS 'Array of anticipated obstacles or challenges';
COMMENT ON COLUMN public.extracted_actions.if_stuck IS 'Alternative approach if primary action stalls';
COMMENT ON COLUMN public.extracted_actions.best_time IS 'Optimal time of day or conditions for this action';
COMMENT ON COLUMN public.extracted_actions.next_natural_steps IS 'What naturally follows after completing this action';
COMMENT ON COLUMN public.extracted_actions.detail_level IS 'Level of detail: minimal, standard, or complete';
COMMENT ON COLUMN public.extracted_actions.alternative_phrasings IS 'Alternative ways to phrase the action (for low confidence actions)';
COMMENT ON COLUMN public.extracted_actions.completion_criteria_specific IS 'Action-type specific completion criteria';
COMMENT ON COLUMN public.extracted_actions.verb_category IS 'Category of the action verb: COMMUNICATION, MEDICAL, PLANNING, COMPLETION, etc.';