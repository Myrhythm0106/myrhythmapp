-- Secure empowerment_statements table by adding authentication requirement
-- This prevents unauthorized access to proprietary content

-- Enable RLS on empowerment_statements table
ALTER TABLE public.empowerment_statements ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view statements
CREATE POLICY "Authenticated users can view empowerment statements" 
ON public.empowerment_statements 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policy for users to track their interactions
CREATE POLICY "Users can create their own statement interactions" 
ON public.user_statement_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to favorite statements
CREATE POLICY "Users can create their own favorites" 
ON public.user_favorite_statements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update Supabase config for enhanced security
-- Reduce OTP expiry from 300 to 60 seconds
-- Enable password breach detection