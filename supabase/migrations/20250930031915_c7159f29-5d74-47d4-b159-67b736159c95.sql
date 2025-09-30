-- Create secure helper function to get current user email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Support members can view actions with permission" ON public.extracted_actions;
DROP POLICY IF EXISTS "Support members can update actions with permission" ON public.extracted_actions;

-- Recreate policies using the secure function
CREATE POLICY "Support members can view actions with permission" 
ON public.extracted_actions 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM support_circle_members scm
    WHERE scm.user_id = extracted_actions.user_id 
    AND scm.member_email = public.get_current_user_email()
    AND scm.status = 'active'
    AND (
      (scm.permissions->>'actions')::boolean = true 
      OR scm.id = ANY(extracted_actions.assigned_watchers)
    )
  )
);

CREATE POLICY "Support members can update actions with permission" 
ON public.extracted_actions 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM support_circle_members scm
    WHERE scm.user_id = extracted_actions.user_id 
    AND scm.member_email = public.get_current_user_email()
    AND scm.status = 'active'
    AND (
      (scm.permissions->>'actions')::boolean = true 
      OR scm.id = ANY(extracted_actions.assigned_watchers)
    )
  )
);

-- Update the support_member_can_access_action function to use the helper
CREATE OR REPLACE FUNCTION public.support_member_can_access_action(p_member_email text, p_action_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  member_id uuid;
BEGIN
  -- Get the member's support circle member ID
  SELECT scm.id INTO member_id
  FROM public.support_circle_members scm
  JOIN public.extracted_actions ea ON ea.user_id = scm.user_id
  WHERE scm.member_email = p_member_email
  AND scm.status = 'active'
  AND ea.id = p_action_id;
  
  IF member_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if they have full actions access OR are specifically assigned as a watcher
  RETURN EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    JOIN public.extracted_actions ea ON ea.user_id = scm.user_id
    WHERE scm.id = member_id
    AND ea.id = p_action_id
    AND (
      (scm.permissions->>'actions')::boolean = true 
      OR member_id = ANY(ea.assigned_watchers)
    )
  );
END;
$$;