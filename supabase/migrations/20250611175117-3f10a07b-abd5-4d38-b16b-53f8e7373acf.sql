
-- Fix missing SELECT policies for critical tables to prevent data exposure

-- Add missing SELECT policy for calendar_events
CREATE POLICY "Users can view their own calendar events" 
  ON public.calendar_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add missing SELECT policy for goals
CREATE POLICY "Users can view their own goals" 
  ON public.goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add missing SELECT policy for gratitude_entries
CREATE POLICY "Users can view their own gratitude entries" 
  ON public.gratitude_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add missing SELECT policy for mood_entries
CREATE POLICY "Users can view their own mood entries" 
  ON public.mood_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add missing SELECT policy for symptom_logs
CREATE POLICY "Users can view their own symptom logs" 
  ON public.symptom_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);
