-- Transform ExtractedActions to Next Steps Items with 4 empowering categories
-- This migration updates the schema to support the new Next Steps framework

-- Add new category column to extracted_actions table
ALTER TABLE public.extracted_actions 
ADD COLUMN category text NOT NULL DEFAULT 'action' 
CHECK (category IN ('action', 'watch_out', 'depends_on', 'note'));

-- Add new professional status field options
ALTER TABLE public.extracted_actions 
DROP CONSTRAINT IF EXISTS extracted_actions_status_check;

ALTER TABLE public.extracted_actions 
ADD CONSTRAINT extracted_actions_status_check 
CHECK (status IN ('not_started', 'doing', 'done', 'pending', 'confirmed', 'rejected', 'completed', 'modified', 'scheduled', 'in_progress', 'on_hold', 'cancelled'));

-- Add owner field for professional assignment tracking
ALTER TABLE public.extracted_actions 
ADD COLUMN owner text;

-- Add created_by field to track who created the next step
ALTER TABLE public.extracted_actions 
ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Add index for efficient category-based queries
CREATE INDEX IF NOT EXISTS idx_extracted_actions_category ON public.extracted_actions(category);
CREATE INDEX IF NOT EXISTS idx_extracted_actions_owner ON public.extracted_actions(owner);
CREATE INDEX IF NOT EXISTS idx_extracted_actions_status_category ON public.extracted_actions(status, category);

-- Update existing records to have default categories based on action_type
UPDATE public.extracted_actions 
SET category = CASE 
    WHEN action_type = 'reminder' THEN 'watch_out'
    WHEN action_text ILIKE '%depend%' OR action_text ILIKE '%need%' OR action_text ILIKE '%wait%' THEN 'depends_on'
    WHEN action_text ILIKE '%note%' OR action_text ILIKE '%remember%' OR action_text ILIKE '%keep in mind%' THEN 'note'
    ELSE 'action'
END
WHERE category = 'action';

-- Set owner based on assigned_to field where it exists
UPDATE public.extracted_actions 
SET owner = assigned_to 
WHERE assigned_to IS NOT NULL AND owner IS NULL;

-- Set created_by to user_id for existing records
UPDATE public.extracted_actions 
SET created_by = user_id 
WHERE created_by IS NULL;

-- Create a function to auto-categorize new actions based on text analysis
CREATE OR REPLACE FUNCTION categorize_next_step_item()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-categorize based on action text content
  IF NEW.action_text ILIKE '%watch%' OR NEW.action_text ILIKE '%aware%' OR NEW.action_text ILIKE '%mind%' 
     OR NEW.action_text ILIKE '%careful%' OR NEW.action_text ILIKE '%notice%' THEN
    NEW.category = 'watch_out';
  ELSIF NEW.action_text ILIKE '%depend%' OR NEW.action_text ILIKE '%need%' OR NEW.action_text ILIKE '%wait%' 
        OR NEW.action_text ILIKE '%require%' OR NEW.action_text ILIKE '%after%' THEN
    NEW.category = 'depends_on';
  ELSIF NEW.action_text ILIKE '%note%' OR NEW.action_text ILIKE '%remember%' OR NEW.action_text ILIKE '%detail%'
        OR NEW.action_text ILIKE '%context%' OR NEW.action_text ILIKE '%background%' THEN
    NEW.category = 'note';
  ELSE
    NEW.category = 'action';
  END IF;
  
  -- Set default owner if not specified
  IF NEW.owner IS NULL THEN
    NEW.owner = COALESCE(NEW.assigned_to, 'me');
  END IF;
  
  -- Set created_by if not specified
  IF NEW.created_by IS NULL THEN
    NEW.created_by = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-categorization
DROP TRIGGER IF EXISTS trigger_categorize_next_step ON public.extracted_actions;
CREATE TRIGGER trigger_categorize_next_step
  BEFORE INSERT ON public.extracted_actions
  FOR EACH ROW
  EXECUTE FUNCTION categorize_next_step_item();