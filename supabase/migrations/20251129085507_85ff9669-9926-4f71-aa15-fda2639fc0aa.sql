-- Phase 1: Fix the extraction_method constraint blocking AI extraction
ALTER TABLE extracted_actions DROP CONSTRAINT IF EXISTS extracted_actions_extraction_method_check;
ALTER TABLE extracted_actions ADD CONSTRAINT extracted_actions_extraction_method_check 
  CHECK (extraction_method = ANY (ARRAY['openai', 'rule-based', 'manual', 'gemini-2.5-flash', 'lovable-ai', 'assemblyai']));

-- Enable pg_cron and pg_net extensions for scheduled reminders
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;