
-- Planning scopes (Day / Week / Month / Year commitments)
CREATE TABLE public.planning_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scope text NOT NULL CHECK (scope IN ('day','week','month','year')),
  period_start date NOT NULL,
  vision_text text,
  core text,
  key text,
  stretch text,
  parent_id uuid REFERENCES public.planning_scopes(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'user' CHECK (source IN ('user','ai_assisted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, scope, period_start)
);

CREATE INDEX idx_planning_scopes_user_scope ON public.planning_scopes(user_id, scope, period_start);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.planning_scopes TO authenticated;
GRANT ALL ON public.planning_scopes TO service_role;

ALTER TABLE public.planning_scopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own planning scopes"
  ON public.planning_scopes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_planning_scopes_updated_at
  BEFORE UPDATE ON public.planning_scopes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User's preferred planning day (0=Sun … 6=Sat). Null = "whenever I open the app on a new week"
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS planning_day_of_week smallint
  CHECK (planning_day_of_week IS NULL OR (planning_day_of_week BETWEEN 0 AND 6));
