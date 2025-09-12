-- Fix profiles table by adding missing columns and making id reference auth.users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create assessment_results table for GDPR-compliant assessment storage
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'brief',
  responses JSONB NOT NULL DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  completion_status TEXT NOT NULL DEFAULT 'in_progress',
  payment_status TEXT NOT NULL DEFAULT 'free',
  raw_assessment_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on assessment_results
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create user_onboarding_progress table for resumable flows
CREATE TABLE public.user_onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_step TEXT NOT NULL DEFAULT 'assessment',
  step_data JSONB NOT NULL DEFAULT '{}',
  assessment_id UUID REFERENCES public.assessment_results(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_onboarding_progress
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_results
CREATE POLICY "Users can view their own assessment results" 
ON public.assessment_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
ON public.assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_onboarding_progress
CREATE POLICY "Users can manage their own progress" 
ON public.user_onboarding_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_assessment_results_updated_at
BEFORE UPDATE ON public.assessment_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_onboarding_progress_updated_at
BEFORE UPDATE ON public.user_onboarding_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();