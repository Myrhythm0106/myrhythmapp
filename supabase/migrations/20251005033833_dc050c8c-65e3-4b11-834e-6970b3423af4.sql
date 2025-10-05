-- Week 2: Create missing Vision Framework tables (simplified)

-- Monthly Themes table
CREATE TABLE IF NOT EXISTS public.monthly_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month)
);

ALTER TABLE public.monthly_themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own monthly themes" ON public.monthly_themes;
CREATE POLICY "Users manage their own monthly themes"
ON public.monthly_themes
FOR ALL
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_monthly_themes_user_year_month ON public.monthly_themes(user_id, year, month);

DROP TRIGGER IF EXISTS update_monthly_themes_updated_at ON public.monthly_themes;
CREATE TRIGGER update_monthly_themes_updated_at
BEFORE UPDATE ON public.monthly_themes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Weekly Affirmations table
CREATE TABLE IF NOT EXISTS public.weekly_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
  affirmation TEXT NOT NULL,
  monthly_theme_id UUID REFERENCES public.monthly_themes(id) ON DELETE SET NULL,
  annual_priority_id UUID REFERENCES public.annual_priorities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, week_number)
);

ALTER TABLE public.weekly_affirmations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own weekly affirmations" ON public.weekly_affirmations;
CREATE POLICY "Users manage their own weekly affirmations"
ON public.weekly_affirmations
FOR ALL
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_affirmations_user_year_week ON public.weekly_affirmations(user_id, year, week_number);

DROP TRIGGER IF EXISTS update_weekly_affirmations_updated_at ON public.weekly_affirmations;
CREATE TRIGGER update_weekly_affirmations_updated_at
BEFORE UPDATE ON public.weekly_affirmations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();