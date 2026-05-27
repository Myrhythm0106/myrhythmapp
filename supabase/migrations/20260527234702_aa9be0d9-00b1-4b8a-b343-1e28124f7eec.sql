
CREATE TABLE public.founding_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug','idea','confusion','praise')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  route TEXT,
  edition_version TEXT NOT NULL DEFAULT 'v0.1',
  ok_to_contact BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.founding_feedback TO authenticated;
GRANT ALL ON public.founding_feedback TO service_role;

ALTER TABLE public.founding_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own feedback"
ON public.founding_feedback FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own feedback"
ON public.founding_feedback FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_founding_feedback_user ON public.founding_feedback(user_id, created_at DESC);
