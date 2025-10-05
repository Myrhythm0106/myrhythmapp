-- Add missing columns to annual_priorities table
ALTER TABLE public.annual_priorities
ADD COLUMN IF NOT EXISTS yearly_theme TEXT,
ADD COLUMN IF NOT EXISTS vision_statement TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Add constraint if year column is new
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'annual_priorities' 
    AND column_name = 'year'
    AND is_nullable = 'YES'
  ) THEN
    -- Make year not null with default
    ALTER TABLE public.annual_priorities 
    ALTER COLUMN year SET DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
    
    UPDATE public.annual_priorities 
    SET year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER 
    WHERE year IS NULL;
    
    ALTER TABLE public.annual_priorities 
    ALTER COLUMN year SET NOT NULL;
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'annual_priorities_user_id_year_key'
  ) THEN
    ALTER TABLE public.annual_priorities 
    ADD CONSTRAINT annual_priorities_user_id_year_key UNIQUE(user_id, year);
  END IF;
END $$;