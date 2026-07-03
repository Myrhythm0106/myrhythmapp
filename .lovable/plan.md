## Full-flow audit plan

You've asked me to verify the app is testable end-to-end. This is an **audit / verification pass**, not a code change. If any issue is found I'll report it and we can decide fixes together in a follow-up.

### Scope — 5 checks

**1. Full flow walk-through (`/launch/*`)**
Trace the intended journey and flag broken hand-offs:
```
/launch/landingpage → register → signin → user-type
   → assessment → payment → welcome → /launch/home
   → capture / commit / calibrate / celebrate loop
   → calendar, memory, gratitude, support, goals, profile, settings
```
Method: read each page's primary CTAs and confirm the `navigate(...)` targets exist as routes and render.

**2. Landing-page link check**
`LaunchLanding` reuses `MVPCore4C`. I'll enumerate every `<a>`, `<Link>`, and `onClick(navigate)` on that page + `LaunchWelcome` and verify each destination is a live route. Report any dead/legacy links (e.g. anything still pointing to `/dashboard`, `/mvp/...`, `/get-started`).

**3. Data-save readiness**
For the write paths that matter for cohort testing:
- Auth (Supabase `profiles` on signup)
- Capture → `daily_actions` / `extracted_actions`
- Commit priorities → `priorities`
- Calibrate → `mood_entries`
- Celebrate → `victory_celebrations` / `gratitude_entries`
- Memory Bridge recording → `voice_recordings` bucket + `meeting_recordings`
- Settings (timezone, calendars) → `user_schedule_preferences` / `calendar_integrations`

Method: for each, confirm the hook actually calls `supabase.from(...).insert/upsert`, RLS policies exist, and the table has the columns the code writes. I'll list any writer that is stubbed/localStorage-only.

**4. Older-generation design check**
Against `mem://ux/inclusive-design-first` guardrails:
- Body text ≥16px on mobile
- Primary tap targets ≥56px (currently the launch quick-action FAB uses `min-h-[48px]` — will flag)
- Line-height ≥1.5
- Max 3 primary choices per screen
- WCAG AA contrast on key surfaces (welcome, home, capture, commit)
- Plain-English labels visible where the 4C words appear

Method: spot-check the 6 highest-traffic launch pages (welcome, home, capture, commit, calendar, memory) and list violations with file + line.

**5. "Never lost" — global compass/back visibility**
Confirm `LaunchQuickActions` (compass FAB) and `LaunchPageHeader` (back button) render on **every** `/launch/*` route:
- Compass is mounted inside `LaunchLayout`. I'll grep every launch page for `LaunchLayout` usage and list any page that renders bare (no layout wrapper → no FAB, no back).
- Verify the FAB is not hidden behind modals/overlays (`z-40` currently — check for higher-z overlays).
- Verify the back button shows on all non-home routes.

### Deliverable

A single report with 5 sections, each ending in **PASS** / **PASS with notes** / **FAIL — needs fix**, plus a prioritised fix list. No code changes in this pass.

### Out of scope
- Runtime Playwright walkthrough of authenticated flows (can add if you want an interactive smoke test after the static audit).
- Fixing anything found — that comes as a follow-up plan.

Approve and I'll run the audit and post the report.