-- Create user_contacts table for persistent personal address book
CREATE TABLE public.user_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, email)
);

-- Enable RLS
ALTER TABLE public.user_contacts ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own contacts
CREATE POLICY "Users can view own contacts"
  ON public.user_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts"
  ON public.user_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON public.user_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON public.user_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER update_user_contacts_updated_at
  BEFORE UPDATE ON public.user_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();