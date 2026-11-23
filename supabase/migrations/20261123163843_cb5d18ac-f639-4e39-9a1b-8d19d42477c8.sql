DROP POLICY IF EXISTS "Anyone can create alerts" ON public.accountability_alerts;
CREATE POLICY "Users create own alerts" ON public.accountability_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "System can create security events" ON public.security_events;
CREATE POLICY "Users create own security events" ON public.security_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "System can manage trial subscriptions" ON public.trial_subscriptions;
DROP POLICY IF EXISTS "System can update transcription jobs" ON public.transcription_jobs;
DROP POLICY IF EXISTS "authenticated_users_view_statements" ON public.empowerment_statements;
CREATE POLICY "authenticated_users_view_statements" ON public.empowerment_statements FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Health professionals can access voice recordings" ON storage.objects;
CREATE POLICY "Health professionals can access voice recordings" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'voice-recordings' AND EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.user_id::text = (storage.foldername(objects.name))[1]
      AND lower(scm.member_email) = lower(public.get_current_user_email())
      AND scm.role = 'medical' AND scm.status = 'active'
      AND (scm.permissions->>'voice_recordings')::boolean = true));