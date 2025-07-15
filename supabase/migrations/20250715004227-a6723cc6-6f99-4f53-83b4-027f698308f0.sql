
-- Insert sample daily actions for today and tomorrow
INSERT INTO public.daily_actions (user_id, title, description, date, start_time, action_type, status, is_daily_win, difficulty_level, focus_area) VALUES
-- Today's actions (mix of completed and pending)
(auth.uid(), 'Morning mindfulness check-in', 'Take 5 minutes to center yourself and set intentions', CURRENT_DATE, '08:00', 'daily_win', 'completed', true, 1, 'emotional'),
(auth.uid(), 'Take morning medication with breakfast', 'Remember to eat something nutritious first', CURRENT_DATE, '08:30', 'routine', 'completed', false, 1, 'physical'),
(auth.uid(), 'Gentle brain exercise - word puzzles', '15 minutes of engaging cognitive activity', CURRENT_DATE, '10:00', 'regular', 'pending', false, 2, 'cognitive'),
(auth.uid(), 'Hydration reminder', 'Drink a full glass of water mindfully', CURRENT_DATE, '11:00', 'routine', 'pending', false, 1, 'physical'),
(auth.uid(), 'Connect with a friend or family member', 'Quick call or text to stay socially connected', CURRENT_DATE, '14:00', 'regular', 'pending', false, 2, 'social'),
(auth.uid(), 'Afternoon rest break', 'Honor your energy levels with intentional rest', CURRENT_DATE, '15:30', 'routine', 'pending', false, 1, 'physical'),
(auth.uid(), 'Gratitude reflection', 'Write down 3 things you appreciate about today', CURRENT_DATE, '19:00', 'daily_win', 'pending', true, 1, 'emotional'),

-- Tomorrow's actions
(auth.uid(), 'Morning energy assessment', 'Check in with how you feel and adjust plans accordingly', CURRENT_DATE + 1, '08:00', 'daily_win', 'pending', true, 1, 'emotional'),
(auth.uid(), 'Physical therapy exercises', 'Complete prescribed balance and strength exercises', CURRENT_DATE + 1, '09:30', 'goal_linked', 'pending', false, 3, 'physical'),
(auth.uid(), 'Creative time - art or music', '30 minutes of creative expression', CURRENT_DATE + 1, '11:00', 'regular', 'pending', false, 2, 'cognitive'),
(auth.uid(), 'Meal preparation practice', 'Simple, nourishing lunch preparation', CURRENT_DATE + 1, '12:00', 'goal_linked', 'pending', false, 2, 'physical'),
(auth.uid(), 'Technology break', 'Step away from screens for mental clarity', CURRENT_DATE + 1, '16:00', 'routine', 'pending', false, 1, 'cognitive'),
(auth.uid(), 'Evening reflection journal', 'Process the day and celebrate small wins', CURRENT_DATE + 1, '20:00', 'daily_win', 'pending', true, 1, 'emotional');

-- Insert empowering weekly goals
INSERT INTO public.goals (user_id, title, description, category, target_date, progress_percentage, status) VALUES
(auth.uid(), 'Build daily movement routine', 'Incorporate gentle movement into each day, even if just 5 minutes', 'physical', CURRENT_DATE + 7, 65, 'active'),
(auth.uid(), 'Strengthen memory with brain games', 'Play cognitive games 3 times this week to support brain health', 'cognitive', CURRENT_DATE + 7, 40, 'active'),
(auth.uid(), 'Connect socially every day', 'Reach out to at least one person daily for meaningful connection', 'social', CURRENT_DATE + 7, 85, 'active'),
(auth.uid(), 'Master simple meal preparation', 'Cook one simple, nutritious meal independently', 'personal', CURRENT_DATE + 14, 25, 'active'),
(auth.uid(), 'Establish consistent sleep routine', 'Go to bed and wake up at regular times to support recovery', 'health', CURRENT_DATE + 21, 70, 'active');

-- Insert upcoming calendar events
INSERT INTO public.calendar_events (user_id, title, description, date, time, type, category) VALUES
-- Today's events
(auth.uid(), 'Physical Therapy Session', 'Weekly PT appointment focusing on balance and coordination', CURRENT_DATE, '10:30', 'appointment', 'medical'),
(auth.uid(), 'Lunch with Support Friend', 'Social connection time with understanding friend', CURRENT_DATE, '12:30', 'social', 'support'),
(auth.uid(), 'Afternoon Recovery Rest', 'Scheduled rest time to recharge energy', CURRENT_DATE, '15:00', 'break', 'self-care'),

-- Tomorrow's events  
(auth.uid(), 'Morning Walk in Nature', 'Gentle outdoor exercise for physical and mental wellness', CURRENT_DATE + 1, '08:30', 'exercise', 'wellness'),
(auth.uid(), 'Occupational Therapy Check-in', 'Review progress on daily living skills', CURRENT_DATE + 1, '14:00', 'appointment', 'medical'),
(auth.uid(), 'Family Video Call', 'Weekly connection with family members', CURRENT_DATE + 1, '18:00', 'social', 'family'),

-- This week's events
(auth.uid(), 'Neurologist Follow-up', 'Quarterly check-in with medical team', CURRENT_DATE + 2, '11:00', 'appointment', 'medical'),
(auth.uid(), 'Support Group Meeting', 'Weekly peer support and sharing session', CURRENT_DATE + 3, '19:00', 'group', 'support'),
(auth.uid(), 'Creative Art Therapy', 'Expressive therapy session for cognitive stimulation', CURRENT_DATE + 4, '15:30', 'therapy', 'wellness'),
(auth.uid(), 'Cooking Class Practice', 'Hands-on learning for meal independence', CURRENT_DATE + 5, '16:00', 'class', 'skill-building');
