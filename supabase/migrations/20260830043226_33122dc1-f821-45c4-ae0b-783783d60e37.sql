REVOKE EXECUTE ON FUNCTION public.notify_circle_of_step_completion(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.withdraw_step_completion_notice(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.my_completion_stats() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.notify_circle_of_step_completion(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.withdraw_step_completion_notice(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_completion_stats() TO authenticated;