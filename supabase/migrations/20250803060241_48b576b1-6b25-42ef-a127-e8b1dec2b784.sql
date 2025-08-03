-- Fix security warnings by setting search_path for functions
DROP FUNCTION IF EXISTS public.user_owns_memory(uuid);
DROP FUNCTION IF EXISTS public.user_can_access_memory(uuid);

-- Recreate functions with proper search_path
CREATE OR REPLACE FUNCTION public.user_owns_memory(memory_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memory_entries 
    WHERE id = memory_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

-- Create function to get user's memory access
CREATE OR REPLACE FUNCTION public.user_can_access_memory(memory_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memory_watchers mw
    JOIN public.memory_entries me ON me.id = mw.memory_id
    WHERE mw.memory_id = memory_uuid 
    AND mw.watcher_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND mw.can_view = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;