-- Manually confirm the test account since email confirmation isn't working properly
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'testuser123@gmail.com' AND email_confirmed_at IS NULL;