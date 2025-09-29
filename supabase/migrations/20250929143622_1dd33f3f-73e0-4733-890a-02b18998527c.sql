-- Create annual_priorities table for storing user's yearly goals
CREATE TABLE IF NOT EXISTS public.annual_priorities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  priority_1 TEXT,
  priority_2 TEXT,
  priority_3 TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.annual_priorities ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own annual priorities" 
ON public.annual_priorities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own annual priorities" 
ON public.annual_priorities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own annual priorities" 
ON public.annual_priorities 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own annual priorities" 
ON public.annual_priorities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_annual_priorities_updated_at
BEFORE UPDATE ON public.annual_priorities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_annual_priorities_user_id ON public.annual_priorities(user_id);