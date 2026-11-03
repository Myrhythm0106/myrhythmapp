# Fix: can't sign in, magic link fails, sign-up seems stuck

## What the logs show (your phone, 16:57–17:01 today)
- **Sign up:** both annabelaaron@gmail.com and annabelaaron@yahoo.com **already have accounts**. When you sign up again, the system quietly does nothing and the screen still says "check your email". So it looks broken when it isn't creating anything.
- **Log in:** the password was rejected each time ("invalid login credentials"). The password typed doesn't match the one saved on the account.
- **Magic link / reset email:** this is the real fault. The email server that sends sign-in emails is **rejecting its own login** (error 535, "authentication credentials invalid"). So no reset or magic-link email can be sent. That's why you're locked out.

## Fix
1. **Repair sign-in emails.** An old outside mail-server login is set up for sign-in emails, and its password no longer works. Move sign-in emails (reset password, magic link, confirm email) onto MyRhythm's built-in sending from **myrhythmapp.com**, with MyRhythm-branded wording. This needs one step from you: a setup card to confirm the domain (about 2 minutes). Until the domain checks finish, emails go from the standard sender, so they still arrive.
2. **Get you back in today.** Once emails work, I send a reset to annabelaaron@gmail.com, you tap the link on your phone, set a new password and sign in.
3. **Clear message on repeat sign-up.** If an email already has an account, show: "You already have an account with this email. Sign in, or reset your password." with both buttons. No more silent "check your email".
4. **Clear message on wrong password.** "That password doesn't match. Reset it in one tap." with a reset button right there, instead of a small error.
5. **"Not signed in" on My account:** offer one big Sign in button there, not a dead end.
6. **Check on your phone:** sign up a fresh email, sign in, reset password, magic link, all four, then report what happened.

## Technical details
- Auth logs: `/otp` 500 with SMTP `535 Authentication credentials invalid`; `/signup` returns `user_repeated_signup`; `/token` 400 `invalid_credentials`.
- Check email domain status, then scaffold managed auth email templates and deploy `auth-email-hook` (replaces custom SMTP).
- SignUpForm: detect repeated signup (returned user with empty `identities`) and show the existing-account message.
- SignInForm / launch sign-in: inline reset CTA on invalid credentials.
