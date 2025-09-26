-- Add actions permission to support circle members
-- First, let's make sure the permissions column can handle the new actions permission
UPDATE public.support_circle_members 
SET permissions = permissions || jsonb_build_object('actions', false)
WHERE permissions IS NULL OR NOT permissions ? 'actions';

-- Create function to check if a support member can access actions for a user
CREATE OR REPLACE FUNCTION public.support_member_can_access_actions(p_member_email text, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.support_circle_members
    WHERE user_id = p_user_id 
    AND member_email = p_member_email
    AND status = 'active'
    AND (permissions->>'actions')::boolean = true
  );
END;
$$;

-- Create function to check if a support member can access a specific action
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

-- Add RLS policy for support members to access actions they have permission for
CREATE POLICY "Support members can view actions with permission"
ON public.extracted_actions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.user_id = extracted_actions.user_id
    AND scm.member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND scm.status = 'active'
    AND (
      (scm.permissions->>'actions')::boolean = true 
      OR scm.id = ANY(extracted_actions.assigned_watchers)
    )
  )
);

-- Allow support members to update action status and add notes for actions they can access
CREATE POLICY "Support members can update actions with permission"
ON public.extracted_actions
FOR UPDATE
TO authenticated
USING (
  public.support_member_can_access_action(
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    id
  )
);

-- Create table for support member action notes
CREATE TABLE public.support_member_action_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.extracted_actions(id) ON DELETE CASCADE,
  support_member_id UUID NOT NULL REFERENCES public.support_circle_members(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'encouragement', -- encouragement, reminder, help_offer, status_update
  is_visible_to_user BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.support_member_action_notes ENABLE ROW LEVEL SECURITY;

-- RLS for support member notes
CREATE POLICY "Support members can create notes for accessible actions"
ON public.support_member_action_notes
FOR INSERT
TO authenticated
WITH CHECK (
  public.support_member_can_access_action(
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    action_id
  )
);

CREATE POLICY "Users can view notes on their actions"
ON public.support_member_action_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.extracted_actions ea
    WHERE ea.id = support_member_action_notes.action_id
    AND ea.user_id = auth.uid()
  )
);

CREATE POLICY "Support members can view their own notes"
ON public.support_member_action_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.id = support_member_action_notes.support_member_id
    AND scm.member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);