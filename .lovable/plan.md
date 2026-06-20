
# Plan v60 — Document the Founding Core flow (docs only, no code)

Goal: before touching navigation or redirects, give you one document you can read top-to-bottom and feel confident about exactly how a Founding Member moves through the app — from first landing on the marketing page, through payment, into the 9 Core routes, through the daily 4C loop, and back out via Settings/Support.

## Scope

- **No code changes.** No route hiding, no redirects, no feature flag wiring.
- **One new doc + two small updates** to existing docs so they all point at the same source of truth.

## Files

### 1. NEW — `docs/v0.1-founding-core-flow.md`

Single source of truth for the Founding Core user flow. Sections:

1. **Map at a glance** — ASCII diagram of the full journey:
   ```
   Public funnel        Onboarding             Daily loop (4C)         Trust & people
   /  →  /mvp/user-    /launch/register  →    /launch/home  ⇄          /launch/support
   type-selection  →   /launch/user-type →    /launch/capture  →       /launch/settings
   /mvp/assessment →   /launch/assessment→    /launch/commit   →       /launch/profile
   /mvp/payment    →   /launch/payment   →    /launch/calibrate→
                       /launch/welcome   →    /launch/memory   ⇄
                                              /launch/calendar
   ```
2. **First-time flow (Day 0)** — step-by-step: discover → assess → pay → welcome → land on `/launch/home`. What the user sees, what they decide, what writes to the DB.
3. **Daily loop (Day 1+)** — the 4C loop as the user actually walks it:
   - Home shows today's energy + 1 next action
   - Capture (voice/text) → Memory Bridge entry
   - Commit (turn capture into action) → Calendar slot
   - Calibrate (end-of-day reflection) → tomorrow's energy estimate
   - Memory Bridge as the always-on index
4. **Re-entry safety** — what happens when a cognitively-loaded user opens the app mid-flow, mid-recording, mid-day. Which screens resume vs restart.
5. **People & trust flow** — Support Circle invites, Settings (retention, MFA, calendars), Profile/persona. What is shared, what is never shared.
6. **What the user does NOT see in v0.1** — the 13 deferred `/launch/*` routes, with the one-line reason each is hidden and where it surfaces instead (e.g. Gratitude folded into Calibrate prompt).
7. **Legacy redirects (planned, not yet wired)** — `/dashboard`, `/memory-bridge`, `/calendar`, `/gratitude`, `/command-center` → their Core equivalents.
8. **State & data touchpoints** — for each Core route, which tables it reads/writes (`voice_recordings`, `extracted_actions`, `calendar_events`, `support_circle_members`, `founding_feedback`, etc.) so you can sanity-check there are no orphaned screens.
9. **Failure & offline behaviour** — what the user sees if mic permission denied, network drops mid-upload, or transcription job is still pending.
10. **Open questions** — anything I'm not 100% sure of, listed for you to confirm before we enforce scope in code.

### 2. UPDATE — `docs/v0.1-features.md`
Add a one-line pointer at the top of section B: *"For the end-to-end user journey across these 9 routes, see `docs/v0.1-founding-core-flow.md`."*

### 3. UPDATE — `docs/founding-core-value-map.md`
Add the same pointer under the intro so marketing/support land on the flow doc too.

## What this plan does NOT do

- Does not hide any `/launch/*` route from navigation.
- Does not add redirects from legacy routes.
- Does not change `MVPTopNav`, `MobileBottomNav`, or `LaunchNav`.
- Does not touch the `FOUNDING_CORE_ONLY` flag (still un-wired).

Those become Plan v61 once you've read the flow doc and confirmed it matches your mental model.

## Deliverable

After approval: one read-through of `docs/v0.1-founding-core-flow.md` should be enough for you to either say "ship it, now enforce in code" or "this step is wrong, fix the flow first."
