-- Phase 1: Critical Security Fixes - Final Version
-- Fix RLS policies to restrict public access to sensitive tables

-- Fix empowerment_statements: Remove public access, require authentication
DROP POLICY IF EXISTS "Everyone can view empowerment statements" ON public.empowerment_statements;
DROP POLICY IF EXISTS "Authenticated users can view empowerment statements" ON public.empowerment_statements;

-- Create single authenticated-only policy for empowerment_statements
CREATE POLICY "authenticated_users_view_statements"
  ON public.empowerment_statements FOR SELECT
  TO authenticated
  USING (true);

-- Note: calendar_integrations_safe is a VIEW and inherits RLS from calendar_integrations table
-- The underlying calendar_integrations table already has proper "Deny direct SELECT" policy
-- No changes needed for calendar_integrations_safe