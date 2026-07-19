
CREATE TABLE public.access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  max_uses INTEGER,
  uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.access_codes TO service_role;
-- No anon/authenticated grants: table is only touched via SECURITY DEFINER function.

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- No policies for regular roles; service_role bypasses RLS.

CREATE TRIGGER update_access_codes_updated_at
BEFORE UPDATE ON public.access_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.redeem_access_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_row public.access_codes%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO v_row FROM public.access_codes
  WHERE upper(code) = upper(trim(p_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  IF NOT v_row.active THEN
    RETURN jsonb_build_object('success', false, 'error', 'inactive_code');
  END IF;

  IF v_row.expires_at IS NOT NULL AND v_row.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'expired_code');
  END IF;

  IF v_row.max_uses IS NOT NULL AND v_row.uses >= v_row.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'code_exhausted');
  END IF;

  UPDATE public.access_codes
  SET uses = uses + 1
  WHERE id = v_row.id;

  UPDATE public.profiles
  SET founding_comped = true, updated_at = now()
  WHERE id = v_user_id;

  INSERT INTO public.security_events (user_id, event_type, event_data)
  VALUES (v_user_id, 'access_code_redeemed', jsonb_build_object('code', v_row.code));

  RETURN jsonb_build_object('success', true, 'status', 'founding_comped');
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_access_code(TEXT) TO authenticated;

INSERT INTO public.access_codes (code, max_uses, expires_at, note) VALUES
  ('TESTER01', 10, NULL, 'Internal tester bundle'),
  ('FOUNDING2026', 50, NULL, 'Founding member cohort'),
  ('FRIENDS', NULL, '2026-09-30 23:59:59+00', 'Friends & family testing');
