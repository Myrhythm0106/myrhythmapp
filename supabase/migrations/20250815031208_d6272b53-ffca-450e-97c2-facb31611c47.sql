-- Fix payment_methods table security vulnerability
-- Remove the overly broad "ALL" policy and create specific policies

-- Drop the existing broad policy
DROP POLICY IF EXISTS "Users can manage their own payment methods" ON public.payment_methods;

-- Create specific INSERT policy with proper WITH CHECK constraint
CREATE POLICY "Users can create their own payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create specific UPDATE policy 
CREATE POLICY "Users can update their own payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create specific DELETE policy
CREATE POLICY "Users can delete their own payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (auth.uid() = user_id);

-- The SELECT policy already exists and is secure