-- ============ 1. Admin read access for evidence ============
CREATE POLICY "Admins can read all analytics events"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all founding feedback"
  ON public.founding_feedback FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all assessment results"
  ON public.assessment_results FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ 2. Product decision log ============
CREATE TABLE public.product_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature text NOT NULL,
  verdict text NOT NULL DEFAULT 'Keep',
  evidence text,
  notes text,
  metric_value numeric,
  decided_by uuid,
  decided_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_decisions TO authenticated;
GRANT ALL ON public.product_decisions TO service_role;

ALTER TABLE public.product_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage product decisions"
  ON public.product_decisions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ 3. Research consent ============
CREATE TABLE public.research_consent (
  user_id uuid PRIMARY KEY,
  granted boolean NOT NULL DEFAULT false,
  consent_version text NOT NULL DEFAULT 'v1',
  granted_at timestamptz,
  withdrawn_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.research_consent TO authenticated;
GRANT ALL ON public.research_consent TO service_role;

ALTER TABLE public.research_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own research consent"
  ON public.research_consent FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============ 4. Pseudonym salt (no client access at all) ============
CREATE TABLE public.research_salt (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  salt text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex')
);
INSERT INTO public.research_salt (id) VALUES (true) ON CONFLICT DO NOTHING;
ALTER TABLE public.research_salt ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.research_salt TO service_role;
-- deliberately no grants to anon/authenticated: unreachable from the API

-- ============ 5. De-identified research event stream ============
CREATE TABLE public.research_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pseudonym_id text NOT NULL,
  persona_band text,
  stage_band text,
  age_band text,
  months_since_event_band text,
  metric text NOT NULL,
  metric_value numeric,
  occurred_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_research_events_metric ON public.research_events (metric, occurred_on);
CREATE INDEX idx_research_events_pseudonym ON public.research_events (pseudonym_id);

GRANT ALL ON public.research_events TO service_role;
ALTER TABLE public.research_events ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT policies and no grants for anon/authenticated.
-- All access goes through the security-definer functions below.

-- ============ 6. Functions ============
CREATE OR REPLACE FUNCTION public.research_pseudonym(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT encode(sha256((s.salt || _user_id::text)::bytea), 'hex')
  FROM public.research_salt s
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.research_pseudonym(uuid) FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_research_event(
  _metric text,
  _metric_value numeric DEFAULT NULL,
  _persona_band text DEFAULT NULL,
  _stage_band text DEFAULT NULL,
  _age_band text DEFAULT NULL,
  _months_since_event_band text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _consented boolean;
BEGIN
  IF _uid IS NULL THEN
    RETURN false;
  END IF;

  SELECT granted INTO _consented
  FROM public.research_consent
  WHERE user_id = _uid;

  IF _consented IS NOT TRUE THEN
    RETURN false;
  END IF;

  INSERT INTO public.research_events (
    pseudonym_id, persona_band, stage_band, age_band,
    months_since_event_band, metric, metric_value
  ) VALUES (
    public.research_pseudonym(_uid),
    _persona_band, _stage_band, _age_band,
    _months_since_event_band, _metric, round(coalesce(_metric_value, 1), 2)
  );

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_research_event(text, numeric, text, text, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.withdraw_research_consent()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RETURN false;
  END IF;

  DELETE FROM public.research_events
  WHERE pseudonym_id = public.research_pseudonym(_uid);

  UPDATE public.research_consent
  SET granted = false, withdrawn_at = now(), updated_at = now()
  WHERE user_id = _uid;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.withdraw_research_consent() TO authenticated;

-- Aggregate reader with a hard k-anonymity floor of 20 contributors
CREATE OR REPLACE FUNCTION public.research_aggregate(_metric text, _days integer DEFAULT 90)
RETURNS TABLE (
  stage_band text,
  contributors integer,
  events integer,
  avg_value numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    coalesce(e.stage_band, 'unspecified') AS stage_band,
    count(DISTINCT e.pseudonym_id)::int AS contributors,
    count(*)::int AS events,
    round(avg(e.metric_value), 2) AS avg_value
  FROM public.research_events e
  WHERE e.metric = _metric
    AND e.occurred_on >= current_date - _days
  GROUP BY coalesce(e.stage_band, 'unspecified')
  HAVING count(DISTINCT e.pseudonym_id) >= 20;
$$;

GRANT EXECUTE ON FUNCTION public.research_aggregate(text, integer) TO authenticated;

-- ============ 7. Founder aggregate readers (admin only) ============
CREATE OR REPLACE FUNCTION public.founder_funnel(_days integer DEFAULT 30)
RETURNS TABLE (step text, step_order integer, users integer, events integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  RETURN QUERY
  WITH steps(step, step_order, patterns) AS (
    VALUES
      ('Landing viewed', 1, ARRAY['page_view_landing','landing_view']),
      ('Assessment started', 2, ARRAY['assessment_started','assessment_start']),
      ('Assessment completed', 3, ARRAY['assessment_completed','assessment_complete']),
      ('Payment page viewed', 4, ARRAY['payment_viewed','package_selected','plan_selected']),
      ('Trial started', 5, ARRAY['trial_started','subscription_started']),
      ('First capture', 6, ARRAY['capture_saved','memory_bridge_saved'])
  )
  SELECT
    s.step,
    s.step_order,
    coalesce(count(DISTINCT a.user_id)::int, 0),
    coalesce(count(a.id)::int, 0)
  FROM steps s
  LEFT JOIN public.analytics_events a
    ON a.event_type = ANY (s.patterns)
   AND a.created_at >= now() - (_days || ' days')::interval
  GROUP BY s.step, s.step_order
  ORDER BY s.step_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.founder_funnel(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.founder_feature_usage(_days integer DEFAULT 30)
RETURNS TABLE (surface text, users integer, uses integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  RETURN QUERY
  SELECT
    coalesce(a.event_data ->> 'surface', a.event_type) AS surface,
    count(DISTINCT a.user_id)::int,
    count(*)::int
  FROM public.analytics_events a
  WHERE a.created_at >= now() - (_days || ' days')::interval
    AND a.event_type <> 'page_view'
  GROUP BY 1
  ORDER BY 3 DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.founder_feature_usage(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.founder_retention(_days integer DEFAULT 90)
RETURNS TABLE (bucket text, users integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  RETURN QUERY
  WITH firsts AS (
    SELECT user_id, min(created_at) AS first_seen
    FROM public.analytics_events
    WHERE user_id IS NOT NULL
      AND created_at >= now() - (_days || ' days')::interval
    GROUP BY user_id
  ),
  activity AS (
    SELECT f.user_id, f.first_seen, a.created_at
    FROM firsts f
    JOIN public.analytics_events a ON a.user_id = f.user_id
  )
  SELECT b.bucket, count(DISTINCT act.user_id)::int
  FROM (VALUES ('Day 1', 1, 2), ('Day 7', 6, 8), ('Day 30', 28, 32)) AS b(bucket, lo, hi)
  LEFT JOIN activity act
    ON act.created_at >= act.first_seen + (b.lo || ' days')::interval
   AND act.created_at < act.first_seen + (b.hi || ' days')::interval
  GROUP BY b.bucket, b.lo
  ORDER BY b.lo;
END;
$$;

GRANT EXECUTE ON FUNCTION public.founder_retention(integer) TO authenticated;