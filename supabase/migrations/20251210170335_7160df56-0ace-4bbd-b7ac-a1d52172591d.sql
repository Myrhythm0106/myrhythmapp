-- Create priorities table (replacing localStorage storage)
CREATE TABLE public.priorities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('daily', 'weekly', 'monthly', 'yearly')),
  priority_number INTEGER NOT NULL CHECK (priority_number BETWEEN 1 AND 3),
  title TEXT NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  date DATE, -- for daily priorities
  week_number INTEGER, -- for weekly (1-53)
  month INTEGER, -- for monthly (1-12)
  year INTEGER NOT NULL DEFAULT EXTRACT(year FROM CURRENT_DATE),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'deferred')),
  is_shareable BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scope, priority_number, date, week_number, month, year)
);

-- Add annual_priority_id to goals table (link goal to vision/annual priority)
ALTER TABLE public.goals 
ADD COLUMN annual_priority_id UUID REFERENCES public.annual_priorities(id) ON DELETE SET NULL;

-- Add priority_id to daily_actions table (link task to priority)
ALTER TABLE public.daily_actions 
ADD COLUMN priority_id UUID REFERENCES public.priorities(id) ON DELETE SET NULL;

-- Create shared_traceability_views table
CREATE TABLE public.shared_traceability_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  support_circle_member_id UUID NOT NULL REFERENCES public.support_circle_members(id) ON DELETE CASCADE,
  view_type TEXT NOT NULL DEFAULT 'full' CHECK (view_type IN ('full', 'goals_only', 'priorities_only')),
  can_comment BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, support_circle_member_id)
);

-- Enable RLS on priorities
ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

-- RLS policies for priorities
CREATE POLICY "Users can manage their own priorities"
ON public.priorities FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Support circle can view shared priorities"
ON public.priorities FOR SELECT
USING (
  is_shareable = true AND
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.user_id = priorities.user_id
    AND scm.member_email = get_current_user_email()
    AND scm.status = 'active'
    AND (scm.permissions->>'goals')::boolean = true
  )
);

-- Enable RLS on shared_traceability_views
ALTER TABLE public.shared_traceability_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_traceability_views
CREATE POLICY "Users can manage their own shared views"
ON public.shared_traceability_views FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Support circle members can view their shared access"
ON public.shared_traceability_views FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.id = shared_traceability_views.support_circle_member_id
    AND scm.member_email = get_current_user_email()
    AND scm.status = 'active'
  )
);

-- Create index for performance
CREATE INDEX idx_priorities_user_scope ON public.priorities(user_id, scope);
CREATE INDEX idx_priorities_goal_id ON public.priorities(goal_id);
CREATE INDEX idx_daily_actions_priority_id ON public.daily_actions(priority_id);
CREATE INDEX idx_goals_annual_priority_id ON public.goals(annual_priority_id);

-- Trigger for updated_at
CREATE TRIGGER update_priorities_updated_at
BEFORE UPDATE ON public.priorities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shared_traceability_views_updated_at
BEFORE UPDATE ON public.shared_traceability_views
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();