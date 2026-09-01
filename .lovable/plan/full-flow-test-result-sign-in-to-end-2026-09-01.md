# Full-flow test result: sign-in to end

I signed in as the tester account on a phone-sized viewport and walked every signed-in surface. The good news: **the whole journey works end to end** — sign-in lands on Home, Memory Bridge shows the capture hub and previous records, Commit lists next steps with dates and priorities, Calendar renders day/week/month/year, Calibrate, Celebrate, Support Circle, Settings, Profile and Continuity all load with no crashes.

Four real defects are quietly failing in the background. None of them stop the app, but each one silently degrades something the user is promised.

## What is broken

**1. My name doesn't load on Home (400 on every page view)**
The display-name lookup queries `profiles.user_id`, but that column does not exist on the profiles table — the request fails three times per Home load. The greeting still works because it falls back to the sign-up name, but the profile name a user sets is never used.

**2. Reminders never load on the Calendar (400, repeated)**
The reminders query asks `extracted_actions` for a `completion_status` column that does not exist. Every reminder fetch on the Calendar fails, so the reminder ladder we built is invisible there.

**3. Calendar connections are blocked (403 — permission denied)**
`calendar_integrations` has no table grant, so Settings and Calendar both fail to read whether Google/Outlook is connected. Connect/disconnect state can't be trusted, and the sync panel can't show the truth.

**4. Duplicate React key warning on Home**
A list on Home renders two children with the same key — a real risk of items duplicating or swapping as the day's data changes.

## Also worth fixing

- **/launch/* pages are open to signed-out visitors.** Home, Memory Bridge, Settings and the rest render with no session — data calls just fail quietly. A signed-out visitor should be sent to sign-in.
- **The tester account shows "Free Plan"** on Profile, not Founding. Worth confirming the entitlement actually landed for the account.

## Fix plan

1. Correct the profiles lookup to the real owner column, and confirm the resolved name renders on Home.
2. Correct the reminders query to the real status columns so reminders appear on the Calendar.
3. Add the missing grants (and confirm the RLS policies) on `calendar_integrations` via a migration, then re-check Settings and Calendar.
4. Fix the duplicate key on the Home list.
5. Add an auth gate to the `/launch/*` routes so signed-out visitors land on sign-in with a return path.
6. Verify the tester account's plan tier and correct it if it isn't Founding.
7. Re-run the same signed-in walkthrough and confirm zero 4xx responses and zero console errors across all ten screens.

## Not yet tested

Live microphone capture, the invitation email send, and the Stripe test-mode checkout can't be driven in a headless browser meaningfully — you asked for sends included, so after the fixes above I'll trigger a real invitation email to your address and run the test checkout, then report what arrived.
