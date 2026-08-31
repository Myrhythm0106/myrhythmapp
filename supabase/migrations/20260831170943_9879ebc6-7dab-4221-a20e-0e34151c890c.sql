ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS ics_uid text,
  ADD COLUMN IF NOT EXISTS ics_sequence integer NOT NULL DEFAULT 0;

ALTER TABLE public.event_invitations
  ADD COLUMN IF NOT EXISTS responded_at timestamptz,
  ADD COLUMN IF NOT EXISTS response_token text,
  ADD COLUMN IF NOT EXISTS invite_source text NOT NULL DEFAULT 'email';

CREATE UNIQUE INDEX IF NOT EXISTS event_invitations_response_token_key
  ON public.event_invitations(response_token)
  WHERE response_token IS NOT NULL;

-- Allow an invitee who is signed in with that email to see and answer their own invitation
CREATE POLICY "Invitees can view their own invitations"
ON public.event_invitations FOR SELECT
TO authenticated
USING (invitee_email = public.get_current_user_email());