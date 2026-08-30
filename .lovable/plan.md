# MyRhythm — Ready for Friends Testing: streamline, prove, sell

Goal: one calm, trustworthy product a friend can open cold, understand in 30 seconds, and use daily — with recording that never fails quietly, and supporters who only ever see what they were given.

## 1. Streamline the MVP (what testers see)

Today `src/launch/routes.ts` defines 24 `/launch/*` routes; 9 are already scope-locked as Founding Core. That is still too many front doors for someone with memory difficulty.

Cut the tester surface to **five**, everything else reachable but not advertised:

```text
Home        my day, one next step, one mic button
Capture     record / upload a conversation
Commit      executive summary + my next steps (+ schedule)
Calendar    what's happening and when
Circle      who's helping me, and what they can see
```

- Calibrate, Celebrate, Growth, Vision, Goals, Games, Analytics, Science, Continuity, Discharge Bridge, Store, Roadmap stay built and URL-reachable, but drop out of the dial and nav for v0.1.
- Home shows at most three choices: *Record something*, *My next steps*, *My day*.
- Every page gets the same header pattern: page name, one sentence of plain-English purpose, one primary action. No page ends without a "what next" link.

## 2. Ease, connectivity and linkage

- **Two taps to anything that matters.** Mic button (already global) → record. Home → next steps. Calendar entry → the conversation it came from.
- **Round trips both ways.** Every action links back to its source recording (reference code already exists) and forward to its calendar entry. Fill any missing direction.
- **No dead ends.** Empty states say what to do next, in first person ("I haven't recorded anything yet — record my first conversation").
- **Reassurance layer for memory difficulty:** persistent "You are here" dial stays; add a one-line "last time you were here you…" on Home; never move primary buttons between pages.
- **Accessibility floor:** 18px body, 56px targets, high contrast, reduced-motion respected — audit the five tester pages only.

## 3. Recording must be 5-star

Recording is the product. Work in this order:

1. **Never fail silently.** Every stage (permission → start → chunk → stop → upload → transcribe → extract) reports one of: working, retrying, failed-with-a-reason-and-a-retry-button.
2. **Nothing is ever lost.** Session persists to IndexedDB during recording; if the tab closes or the phone locks, the next visit offers "recover my recording".
3. **Visible proof it is listening** — live level meter, elapsed clock, remaining-allowance egg timer, all on screen while recording.
4. **Upload resilience** — retry with backoff, clear progress, and "keep this on my device and try again later" if offline.
5. **Playback always works or explains itself** — plays, scrubs, or says plainly that the audio was purged after 30 days while the summary is kept.
6. **Device matrix test:** iPhone Safari, iPhone PWA, Android Chrome, laptop Chrome, laptop Safari — 2-minute and 30-minute recording each, recorded in a short results table.

## 4. Support workers see only what they were given

The building blocks already exist (`src/config/supportCircle.ts` role presets, `support_circle_members.permissions`, a separate support-member dashboard, and a redirect for support members). What needs proving and tightening:

- **Server-side enforcement audit.** Confirm by query that RLS — not UI — is what stops a supporter reading calendar, actions, growth or health data they were not granted. Anything enforced only in the UI gets a policy.
- **Plain-English permission screen.** For each person: *Sees my wins* / *Sees my calendar and next steps* / *Can add and edit with me* / *Clinician view*. One toggle row each, revocable in one tap, with "what they can see right now" shown back to the owner.
- **Supporter view is read-mostly and clearly bounded** — a banner naming whose account they are viewing and what they can do.
- **Separate accounts, separate purchases.** A supporter account holds no MyRhythm plan of its own. When a supporter tries to record, plan or capture for themselves, they hit a warm upgrade screen: "This is Jane's circle view. To run your own rhythm, start your own MyRhythm." No seat sharing, no shared logins; the invite creates a circle membership, never a licence.

## 5. Value, and what to say about it

The honest value is not transcription — it is **follow-through**: the app that keeps your plan going after the appointment ends or the commitment has been made. Recording → agreed next steps → in the diary → the right people looped in → a board-ready summary anyone can read.

**Who to market to first (zero budget, in order):**
1. Close friends and family — 10–15 people, personal ask.
2. People who carry a lot: carers, working parents, anyone juggling appointments — the "ideal-brain assumption" audience.
3. Post-rehab and memory-difficulty communities via one or two trusted intermediaries.
4. Rehab and clinic staff — later, once testers have produced real summaries.

**How to sell with no funds:**
- One-to-one demos, 10 minutes, recorded live in front of them — the demo *is* the product.
- Founding Member pricing already fixed (£10/mo for life, 500 seats) with Friends & Family invite codes.
- Ask every tester for one referral and one quote; quotes become the landing page.

**How to advertise for free:**
- Founder story posts on LinkedIn, weekly, showing one real artefact per post (a summary, a diary, a circle view).
- A short Loom walkthrough reused everywhere.
- Two or three community/forum posts where the problem already gets discussed, no pitching.

## 6. Ready-for-friends checklist

- [ ] Tester surface cut to 5 pages; dial and nav match
- [ ] Home passes the 30-second cold-open test
- [ ] Recording device matrix passed, results recorded
- [ ] Recovery from interrupted recording proven
- [ ] Permission audit done; no UI-only protection remains
- [ ] Supporter upgrade wall in place
- [ ] Every empty state has a next action
- [ ] One-page tester welcome + how to give feedback
- [ ] Feedback button reachable from every tester page

## Technical notes

- Route trimming: `FOUNDING_CORE_PATHS` in `src/launch/routes.ts` becomes the 5 tester paths; the dial and any nav read from it, so no route deletion is needed.
- Recording work centres on `src/hooks/useVoiceRecorder.ts` (stage state machine, retry, recovery) and `src/pages/launch/LaunchMemoryBridge.tsx` (status surface).
- Permissions: verify policies on the support-circle-readable tables with live queries before changing anything; add policies only where a query proves a gap.
- Supporter licensing: gate on support-member role at the launch layout level, routing supporters to their dashboard plus an upgrade screen rather than the owner surfaces.
- No schema changes assumed beyond any RLS policies the audit proves are missing.
