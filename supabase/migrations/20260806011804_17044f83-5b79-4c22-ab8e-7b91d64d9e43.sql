CREATE TABLE public.founder_playbook_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  horizon TEXT NOT NULL DEFAULT 'H0',
  item_key TEXT NOT NULL UNIQUE,
  status TEXT,
  value TEXT,
  note TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.founder_playbook_progress TO authenticated;
GRANT ALL ON public.founder_playbook_progress TO service_role;

ALTER TABLE public.founder_playbook_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage playbook progress"
ON public.founder_playbook_progress
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_founder_playbook_progress_updated_at
BEFORE UPDATE ON public.founder_playbook_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();