-- Update transcription_jobs policies for OpenAI flow
-- Allow users to create their own transcription jobs
CREATE POLICY "Users can create their own transcription jobs" 
ON public.transcription_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own transcription jobs
CREATE POLICY "Users can update their own transcription jobs" 
ON public.transcription_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow system to update transcription jobs (for edge function processing)
CREATE POLICY "System can update transcription jobs" 
ON public.transcription_jobs 
FOR UPDATE 
USING (true);