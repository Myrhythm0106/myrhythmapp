-- Add missing start_date and end_date fields to extracted_actions table
ALTER TABLE public.extracted_actions 
ADD COLUMN start_date date,
ADD COLUMN end_date date;