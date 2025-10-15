-- ============================================
-- COMPREHENSIVE SECURITY HARDENING MIGRATION (FIXED)
-- ============================================

-- PART 1: Create User Roles System (RBAC)
-- ============================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Grant initial admin role to the primary user
INSERT INTO public.user_roles (user_id, role)
VALUES ('8d35ff32-d170-404a-93af-e3b6eed04333', 'admin')
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 2: Create Server-Side Onboarding Table
-- ============================================

CREATE TABLE public.user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed BOOLEAN NOT NULL DEFAULT false,
  current_step INTEGER NOT NULL DEFAULT 1,
  chosen_path TEXT CHECK (chosen_path IN ('guided', 'explorer')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS policies for onboarding
CREATE POLICY "Users can view own onboarding"
ON public.user_onboarding FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding"
ON public.user_onboarding FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
ON public.user_onboarding FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_onboarding_updated_at
BEFORE UPDATE ON public.user_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PART 3: Fix Analytics Events RLS Policies
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "allow_insert_analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "select_own_analytics" ON public.analytics_events;

-- Create secure policies
CREATE POLICY "Authenticated users can insert own analytics"
ON public.analytics_events FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR user_id IS NULL)
);

CREATE POLICY "Users can view own analytics only"
ON public.analytics_events FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- PART 4: Security Event Logging
-- ============================================

-- Log this security hardening event
INSERT INTO public.security_events (
  user_id,
  event_type,
  event_data
) VALUES (
  '8d35ff32-d170-404a-93af-e3b6eed04333',
  'SECURITY_HARDENING_APPLIED',
  jsonb_build_object(
    'migration_type', 'comprehensive_security_hardening',
    'changes', jsonb_build_array(
      'user_roles_table_created',
      'rbac_implemented',
      'onboarding_table_created',
      'analytics_rls_fixed'
    ),
    'timestamp', NOW()
  )
);