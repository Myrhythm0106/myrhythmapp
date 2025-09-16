-- Populate sample dates for existing extracted actions to demonstrate the three-date system
-- This will allow the UI to immediately show the date fields working

UPDATE extracted_actions 
SET 
  start_date = CASE 
    WHEN due_context LIKE '%today%' THEN CURRENT_DATE
    WHEN due_context LIKE '%tomorrow%' THEN CURRENT_DATE
    ELSE CURRENT_DATE
  END,
  completion_date = CASE 
    WHEN due_context LIKE '%today%' THEN CURRENT_DATE
    WHEN due_context LIKE '%tomorrow%' THEN CURRENT_DATE + INTERVAL '1 day'
    WHEN due_context LIKE '%week%' THEN CURRENT_DATE + INTERVAL '7 days'
    ELSE CURRENT_DATE + INTERVAL '3 days'
  END,
  end_date = CASE 
    WHEN due_context LIKE '%week%' THEN CURRENT_DATE + INTERVAL '7 days'
    WHEN LENGTH(action_text) > 50 THEN CURRENT_DATE + INTERVAL '7 days'
    ELSE CURRENT_DATE + INTERVAL '3 days'
  END
WHERE start_date IS NULL 
  AND completion_date IS NULL 
  AND end_date IS NULL;