CREATE TABLE public.continuity_thread (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  thread_date date NOT NULL DEFAULT CURRENT_DATE,
  persona text NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  carry_forward jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX continuity_thread_user_date_idx ON public.continuity_thread (user_id, thread_date DESC, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.continuity_thread TO authenticated;
GRANT ALL ON public.continuity_thread TO service_role;

ALTER TABLE public.continuity_thread ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own continuity thread"
ON public.continuity_thread
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_continuity_thread_updated_at
BEFORE UPDATE ON public.continuity_thread
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();