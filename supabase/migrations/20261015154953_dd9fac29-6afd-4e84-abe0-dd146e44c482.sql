ALTER TABLE public.voice_recordings ADD COLUMN IF NOT EXISTS audio_notice_history jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE OR REPLACE FUNCTION public.keep_requested_meeting_transcript() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF NEW.recording_id IS NOT NULL AND NEW.transcript IS NOT NULL AND NEW.transcript_deleted_at IS NULL AND NEW.output_mode IN ('both','transcript') AND (TG_OP='INSERT' OR OLD.transcript IS NULL) THEN
 UPDATE public.voice_recordings SET keep_transcript=true WHERE id=NEW.recording_id AND user_id=NEW.user_id AND keep_transcript=false;
 END IF; RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.keep_requested_meeting_transcript() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER keep_requested_meeting_transcript AFTER INSERT OR UPDATE OF transcript ON public.meeting_recordings FOR EACH ROW EXECUTE FUNCTION public.keep_requested_meeting_transcript();
CREATE OR REPLACE FUNCTION public.queue_audio_removal_notices() RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r record; milestone integer; notice_key jsonb; notice_count integer:=0;
BEGIN
 FOR r IN SELECT id,user_id,title,audio_expires_at,audio_notice_history,keep_transcript FROM public.voice_recordings WHERE audio_deleted_at IS NULL AND audio_expires_at>now() AND audio_expires_at<=now()+interval '7 days' AND legal_retention_required=false FOR UPDATE SKIP LOCKED LOOP
 milestone:=CASE WHEN r.audio_expires_at<=now()+interval '1 day' THEN 1 WHEN r.audio_expires_at<=now()+interval '3 days' THEN 3 ELSE 7 END;
 notice_key:=jsonb_build_object('expires_at',r.audio_expires_at,'days',milestone);
 IF NOT r.audio_notice_history @> jsonb_build_array(notice_key) THEN
 INSERT INTO public.cross_device_notifications(user_id,notification_type,device_source,data,expires_at) VALUES(r.user_id,'audio_retention','system',jsonb_build_object('recording_id',r.id,'event_title',r.title,'days',milestone,'audio_expires_at',r.audio_expires_at,'message','Audio is scheduled for removal on '||to_char(r.audio_expires_at,'DD Mon YYYY')||'. '||CASE WHEN r.keep_transcript THEN 'The transcript, next steps and reference will stay.' ELSE 'My chosen write-up setting still applies.' END),r.audio_expires_at);
 UPDATE public.voice_recordings SET audio_notice_history=audio_notice_history||jsonb_build_array(notice_key) WHERE id=r.id;
 notice_count:=notice_count+1;
 END IF;
 END LOOP;
 RETURN notice_count;
END; $$;
REVOKE ALL ON FUNCTION public.queue_audio_removal_notices() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.queue_audio_removal_notices() TO service_role;