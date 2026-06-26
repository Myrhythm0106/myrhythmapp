## Goal

Keep "Confirm email" ON in Supabase so sign-ups stay verified — without spending money and without depending on the broken custom SMTP (Resend 535 auth error).

## Why the current setup is failing

Supabase is configured to send confirmation emails through a custom SMTP (Resend) using credentials that are no longer valid. Every sign-up hits `535 Authentication credentials invalid` → Supabase returns `500 Error sending confirmation email` → the UI shows "Sign up failed." Nothing in the app code can fix this; it's a Supabase Auth setting.

## Recommended path: Lovable Managed Auth Emails

Lovable has a built-in auth email system that:
- Uses the platform's own sending infrastructure (no Resend key, no SMTP config, no extra cost)
- Is automatically credentialed via `LOVABLE_API_KEY` (already in your secrets)
- Lets you keep "Confirm email" ON
- Sends branded templates (signup confirmation, password reset, magic link, invite, email change, reauth)

This replaces the broken custom SMTP entirely with a working, free, in-platform sender.

## Steps

1. **Set up an email sender domain** (one-time, via the in-chat email setup dialog). You can use a Lovable-provided subdomain — no domain purchase or DNS work required from you if you don't have one ready. If you do want emails to come from `@myrhythmapp.com`, we add 2 NS records at your registrar and Lovable manages the rest.
2. **Scaffold the auth email templates** — creates 6 branded React Email templates + the `auth-email-hook` edge function, all wired up automatically.
3. **Brand the templates** to match MyRhythm (orange/purple palette, logo, tone). Reads `src/index.css` and applies your colors/fonts to each template.
4. **Deploy** the `auth-email-hook` edge function.
5. **In Supabase Auth → SMTP Settings:** disable the broken custom Resend SMTP so Supabase routes through the new hook instead. Keep "Confirm email" **ON**.
6. **Verify end-to-end:** run a live Playwright sweep — register a fresh test account, confirm the email arrives, click the link, land in onboarding.

## What you have to do vs what I do

**You:**
- Click "Set up email domain" when the dialog appears
- Choose: use a Lovable subdomain (instant, zero config) **or** delegate `mail.myrhythmapp.com` (paste 2 NS records at your registrar — ~5 min)
- Toggle off the custom Resend SMTP in Supabase Auth settings (I'll give you the exact link)

**I do:**
- Scaffold + brand + deploy the templates and edge function
- Re-run the live registration sweep to confirm the husband + 5 friends will get working confirmation emails

## Cost

£0. Lovable Managed Auth Emails are included — no Resend, no SendGrid, no per-email charge at this volume.

## Trade-offs vs Option A (disable confirmation)

| | Managed Auth Emails (this plan) | Disable confirmation (previous suggestion) |
|---|---|---|
| Cost | £0 | £0 |
| Setup time | ~10 min (mostly your domain choice) | 5 seconds |
| Email verification | ✅ Kept ON | ❌ Off |
| Ready for public launch | ✅ Yes — same system scales | ❌ Must redo before launch |
| Risk | Low — managed by Lovable | Medium — anyone can sign up with any email |

## Open question before I proceed

Do you want emails to come from a **Lovable subdomain** (instant, no DNS) or from **your own `myrhythmapp.com`** (5-min DNS setup, more professional)? If unsure, I recommend the Lovable subdomain for the founding circle, then switching to your domain pre-public-launch.