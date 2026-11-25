DROP POLICY IF EXISTS "authenticated_users_view_statements" ON public.empowerment_statements;
REVOKE ALL ON public.empowerment_statements FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.empowerment_statements FROM authenticated;
GRANT SELECT ON public.empowerment_statements TO authenticated;
GRANT ALL ON public.empowerment_statements TO service_role;
CREATE POLICY "members_with_profile_view_statements"
ON public.empowerment_statements FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()));