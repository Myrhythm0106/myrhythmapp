CREATE TABLE public.recording_month_usage (user_id uuid NOT NULL,month_start date NOT NULL,used_seconds bigint NOT NULL DEFAULT 0,recording_count integer NOT NULL DEFAULT 0,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,month_start));
GRANT SELECT ON public.recording_month_usage TO authenticated;
GRANT ALL ON public.recording_month_usage TO service_role;
ALTER TABLE public.recording_month_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_recording_usage ON public.recording_month_usage FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE TRIGGER recording_usage_updated BEFORE UPDATE ON public.recording_month_usage FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.protect_recording_entitlement_fields() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF current_user IN ('authenticated','anon') THEN
 IF TG_TABLE_NAME='subscriptions' THEN
 IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.plan_type IS DISTINCT FROM OLD.plan_type OR NEW.status IS DISTINCT FROM OLD.status OR NEW.trial_end IS DISTINCT FROM OLD.trial_end OR NEW.current_period_end IS DISTINCT FROM OLD.current_period_end OR NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN RAISE EXCEPTION 'Membership changes must use the membership service'; END IF;
 ELSE IF NEW.founding_comped IS DISTINCT FROM OLD.founding_comped THEN RAISE EXCEPTION 'Access codes must be redeemed using the access-code service'; END IF; END IF;
 END IF; RETURN NEW; END; $$;
CREATE TRIGGER protect_recording_subscription BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.protect_recording_entitlement_fields();
CREATE TRIGGER protect_recording_comped BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_recording_entitlement_fields();
CREATE OR REPLACE FUNCTION public.recording_limits_for_user(p_user uuid) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$ DECLARE s record; tier text:='free'; comped boolean; BEGIN
 SELECT founding_comped INTO comped FROM public.profiles WHERE id=p_user;
 SELECT * INTO s FROM public.subscriptions WHERE user_id=p_user ORDER BY created_at DESC LIMIT 1;
 IF comped IS TRUE THEN tier:='founding';
 ELSIF s.status IN ('trial','trialing') AND s.trial_end>=current_date THEN tier:='regular';
 ELSIF s.status IN ('active','paid') AND (s.current_period_end IS NULL OR s.current_period_end>=current_date) THEN
 tier:=CASE WHEN lower(s.plan_type) LIKE '%friends%' OR lower(s.plan_type) IN ('ff','family_smart') THEN 'friends_family' WHEN lower(s.plan_type) LIKE '%founding%' OR lower(s.plan_type) IN ('smart_pro','premium') THEN 'founding' ELSE 'regular' END;
 END IF;
 RETURN jsonb_build_object('tier',tier,'monthly_seconds',CASE WHEN tier='free' THEN 14400 WHEN tier='regular' THEN 144000 ELSE 288000 END,'session_seconds',CASE WHEN tier='free' THEN 14400 WHEN tier='regular' THEN 7200 ELSE 14400 END);
 END; $$;
REVOKE ALL ON FUNCTION public.recording_limits_for_user(uuid) FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.my_recording_balance() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$ DECLARE lim jsonb; used bigint; n integer; start_date date:=(date_trunc('month',now() AT TIME ZONE 'UTC'))::date; BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in to check recording time'; END IF;
 lim:=public.recording_limits_for_user(auth.uid());
 SELECT used_seconds,recording_count INTO used,n FROM public.recording_month_usage WHERE user_id=auth.uid() AND month_start=start_date;
 RETURN lim||jsonb_build_object('used_seconds',coalesce(used,0),'recording_count',coalesce(n,0),'remaining_seconds',greatest(0,(lim->>'monthly_seconds')::bigint-coalesce(used,0)),'resets_at',(start_date+interval '1 month') AT TIME ZONE 'UTC'); END; $$;
REVOKE ALL ON FUNCTION public.my_recording_balance() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.my_recording_balance() TO authenticated;
CREATE OR REPLACE FUNCTION public.account_recording_seconds() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE month_key date; charge bigint; lim jsonb; used bigint; BEGIN
 IF TG_OP='UPDATE' THEN
 IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN RAISE EXCEPTION 'Recording ownership and date cannot be changed'; END IF;
 charge:=greatest(0,coalesce(NEW.duration_seconds,0)-coalesce(OLD.duration_seconds,0));
 ELSE charge:=coalesce(NEW.duration_seconds,0); END IF;
 IF charge<0 THEN RAISE EXCEPTION 'Recording duration must be positive'; END IF;
 IF TG_OP='INSERT' THEN NEW.created_at:=now(); END IF;
 month_key:=date_trunc('month',NEW.created_at AT TIME ZONE 'UTC')::date;
 lim:=public.recording_limits_for_user(NEW.user_id);
 IF coalesce(NEW.duration_seconds,0)>(lim->>'session_seconds')::bigint THEN RAISE EXCEPTION 'This recording is longer than the available recording limit'; END IF;
 INSERT INTO public.recording_month_usage(user_id,month_start) VALUES(NEW.user_id,month_key) ON CONFLICT DO NOTHING;
 SELECT used_seconds INTO used FROM public.recording_month_usage WHERE user_id=NEW.user_id AND month_start=month_key FOR UPDATE;
 IF charge>0 AND used+charge>(lim->>'monthly_seconds')::bigint THEN RAISE EXCEPTION 'Not enough recording minutes remain this month'; END IF;
 UPDATE public.recording_month_usage SET used_seconds=used_seconds+charge,recording_count=recording_count+CASE WHEN TG_OP='INSERT' THEN 1 ELSE 0 END WHERE user_id=NEW.user_id AND month_start=month_key;
 RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.account_recording_seconds() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER account_voice_recording BEFORE INSERT OR UPDATE OF duration_seconds,user_id,created_at ON public.voice_recordings FOR EACH ROW EXECUTE FUNCTION public.account_recording_seconds();
CREATE OR REPLACE FUNCTION public.queue_audio_removal_notices() RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE r record; milestone integer; notice_key jsonb; n integer:=0; BEGIN
 FOR r IN SELECT id,user_id,title,audio_expires_at,audio_notice_history,keep_transcript FROM public.voice_recordings WHERE audio_deleted_at IS NULL AND audio_expires_at>now() AND audio_expires_at<=now()+interval '7 days' AND legal_retention_required=false FOR UPDATE SKIP LOCKED LOOP
 milestone:=CASE WHEN r.audio_expires_at<=now()+interval '1 day' THEN 1 WHEN r.audio_expires_at<=now()+interval '2 days' THEN 2 WHEN r.audio_expires_at<=now()+interval '3 days' THEN 3 ELSE 7 END;
 notice_key:=jsonb_build_object('expires_at',r.audio_expires_at,'days',milestone);
 IF NOT r.audio_notice_history @> jsonb_build_array(notice_key) THEN
 UPDATE public.cross_device_notifications SET is_read=true WHERE user_id=r.user_id AND notification_type='audio_retention' AND data->>'recording_id'=r.id::text;
 INSERT INTO public.cross_device_notifications(user_id,notification_type,device_source,data,expires_at) VALUES(r.user_id,'audio_retention','system',jsonb_build_object('recording_id',r.id,'event_title',r.title,'days',milestone,'audio_expires_at',r.audio_expires_at,'message','Audio removal is scheduled for '||to_char(r.audio_expires_at,'DD Mon YYYY')||'. '||CASE WHEN r.keep_transcript THEN 'My transcript, next steps and reference stay.' ELSE 'My chosen write-up setting still applies.' END),r.audio_expires_at);
 UPDATE public.voice_recordings SET audio_notice_history=audio_notice_history||jsonb_build_array(notice_key) WHERE id=r.id; n:=n+1;
 END IF; END LOOP; RETURN n; END; $$;
REVOKE ALL ON FUNCTION public.queue_audio_removal_notices() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.queue_audio_removal_notices() TO service_role;