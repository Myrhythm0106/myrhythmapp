-- Add structured action fields for brain injury-optimized format
ALTER TABLE public.extracted_actions 
ADD COLUMN what_outcome TEXT,
ADD COLUMN how_steps TEXT[],
ADD COLUMN micro_tasks JSONB DEFAULT '[]'::jsonb;