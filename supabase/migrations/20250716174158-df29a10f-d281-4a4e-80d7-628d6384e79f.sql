-- Add emotional wellness tracking to mood_entries table
ALTER TABLE public.mood_entries 
ADD COLUMN IF NOT EXISTS emotions TEXT[],
ADD COLUMN IF NOT EXISTS emotional_note TEXT,
ADD COLUMN IF NOT EXISTS gratitude_note TEXT,
ADD COLUMN IF NOT EXISTS context TEXT DEFAULT 'daily';

-- Add index for emotions array for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_emotions ON public.mood_entries USING GIN(emotions);

-- Add index for context field
CREATE INDEX IF NOT EXISTS idx_mood_entries_context ON public.mood_entries (context);

-- Update existing records to have default context
UPDATE public.mood_entries 
SET context = 'daily' 
WHERE context IS NULL;