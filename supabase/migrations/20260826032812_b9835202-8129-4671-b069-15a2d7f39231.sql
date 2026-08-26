REVOKE ALL ON FUNCTION public.generate_reference_code(uuid, text, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_meeting_reference_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_action_reference_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_retention_to_voice_recording() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cleanup_expired_voice_recordings() FROM PUBLIC, anon, authenticated;