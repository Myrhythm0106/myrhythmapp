-- Fix existing records with wrong status
UPDATE extracted_actions 
SET status = 'not_started' 
WHERE status = 'pending';