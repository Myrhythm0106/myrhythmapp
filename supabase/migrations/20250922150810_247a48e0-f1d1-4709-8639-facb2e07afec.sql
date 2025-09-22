-- Delete Annabel Aaron account to free up email for reuse
-- User ID: ad01ad44-9edc-4452-b5ef-34dccda29453
-- Email: annabelaaron@gmail.com

-- 1. Delete from public.profiles table
DELETE FROM public.profiles 
WHERE id = 'ad01ad44-9edc-4452-b5ef-34dccda29453';

-- 2. Clean up any email verification records
DELETE FROM public.email_verifications 
WHERE email = 'annabelaaron@gmail.com' 
OR user_id = 'ad01ad44-9edc-4452-b5ef-34dccda29453';

-- 3. Delete from auth.users table (this frees up the email)
DELETE FROM auth.users 
WHERE id = 'ad01ad44-9edc-4452-b5ef-34dccda29453';