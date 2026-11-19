# MyRhythm: calendar polish, one clear journey, MVP and release plan

## Part 1 — Calendar changes (build now)
1. **Curved "My Vision in ACTion" box** — round all corners of the vision box on Day, Week, Month and Year (same soft curve as other cards), so it reads as one elegant card, not a strip.
2. **Today's schedule sits directly under the Today box** — on the Day view, the day's appointments and steps move up to sit immediately beneath the Today heading/box. The "send my week" and calendar-connection bars move below the schedule, so the first thing seen is: Today → what's on.

## Part 2 — My professional view of how the app is organised

**Honest diagnosis:** the features are strong (recording, write-ups, actions, diary, Support Circle, vision, assessment). The risk is not missing features — it is too many doors. A person with memory challenges should never have to choose between more than three things, and never wonder "what now?".

**The single organising idea:** *Capture is the heart; everything else serves it.* Every screen leads back to "record, and it's handled".

### The one journey (first time)
```text
Landing → Create account → Short questions (6 min) → My snapshot (free value)
 → Warm welcome + "what to expect" → Guide me / Explore my way
 → Set up (3 steps: phone shortcut, connect Google/Outlook, invite one person - all skippable)
 → Home
```
**Commercial advice on payment:** do not ask for payment before the snapshot. Give value first, then offer a **7-day free trial with card at the end of setup** ("Start my 7 days"), with "Not now" always available. Payment-first loses this audience; value-first converts better and builds trust.

### Every day after (only three places)
1. **Record** — one big button on Home, always 1 tap (plus phone back-tap/Home Screen shortcut). Planned meetings in the diary show "Record this" at start time. Nothing records without a tap.
2. **Today** — top 3 priorities, today's schedule, yesterday/tomorrow on request.
3. **My circle** — who's helping, what's shared (can be hidden).

Everything else (Vision, full calendar views, assessment, settings, help) lives in the You-Are-Here dial — there when wanted, never in the way.

### Every recording, guaranteed minimum
Write-up always saved → full meeting/conversation fully recorded as a transcript → key points → agreed actions (plus optional "implied" and "ideas" to accept/decline) → one-tap: add to diary, email, share with circle. Audio saving is optional.

## Part 3 — The MVP (what makes it worth £15/month)
The MVP is **"Remember the conversation, and follow it through."**
- Account, questions, snapshot, welcome, Guide me / Explore
- 1-tap recording (phone) + upload of watch/phone recordings
- Write-up, key points, actions table, email/share
- Accept actions into diary with suggested times
- Home: top 3, today's schedule, next step
- Calendar Day/Week/Month/Year + Google/Outlook connection
- Support Circle: invite, diary sharing levels, off switch
- 7-day trial and payment (test mode until launch gate passes)

Why £15 is justified: it replaces a note-taker, a planner and a reminder system, and gives family peace of mind — compared to Otter/Plaud (capture only) or Tiimo (planning only), it is the only one that carries a conversation through to done, with people alongside.

## Part 4 — Release plan
| Release | When | What |
|---|---|---|
| v0.1 Founding | 1 Aug 2026 (founders, 5–15 people) | The MVP above, real-phone tests passed |
| v0.2 | Sep 2026 | Before-meeting briefing, "What did I promise?", end-of-day wrap-up, Support Circle "bring a witness" |
| v0.3 | Oct 2026 (public launch 29 Oct) | Apple Watch shortcut, discharge summary to plan, full MYRHYTHM picture |
| v1.x | 2027 | Native watch app, clinician handout, provider directory |

## Part 5 — Flow fixes to do after approval (in this order)
1. Calendar changes (Part 1).
2. Walk the full first-time journey signed in; remove any screen with more than 3 choices or unclear next step.
3. Add the "Set up" screen (3 skippable steps) after welcome, if not already linked in the journey.
4. Move trial/payment offer to end of setup, with "Not now".
5. Make "Record" the first thing on Home and add "Record this" on diary items at start time.
6. Confirm every recording always saves the write-up, key points and actions, with email/share.

## Technical notes
- Vision box: `LaunchCommitmentBanner.tsx` — use `rounded-2xl` on all variants.
- Day view order in `LaunchCalendar.tsx` / `LaunchDayView`: schedule card directly after Today header; `SendMyWeekBar` and `LaunchSyncBar` move below.
- Journey order stays governed by `getEntryState`/`JourneySteps`; add a Setup step only if it stays skippable.
