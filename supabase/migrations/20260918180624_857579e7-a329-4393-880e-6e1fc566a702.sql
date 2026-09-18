CREATE TABLE public.calendar_feed_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX calendar_feed_tokens_user_idx ON public.calendar_feed_tokens (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_feed_tokens TO authenticated;
GRANT ALL ON public.calendar_feed_tokens TO service_role;

ALTER TABLE public.calendar_feed_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own calendar link"
ON public.calendar_feed_tokens
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);