# MyRhythm: what is SMART, reliable and dependable today — and what still needs hardening

Goal: give a candid, evidence-based answer to whether MyRhythm can be trusted as a daily habit, then close the remaining gaps before friends-and-family testing.

## 1. Current scorecard (verified from the codebase)

| Area | Verdict | Evidence |
|------|---------|----------|
| **Auth/session survival** | GREEN | `src/utils/ensureSession.ts` refreshes expired tokens before blocking; `LaunchMemoryBridge.tsx:421-433` uses it before save and keeps the recording safe if refresh fails; `touchSession` runs on visibility change and every 10 min while recording (`LaunchMemoryBridge.tsx:192-205`). |
| **Recording does not get lost** | GREEN | `src/utils/pendingRecording.ts` parks the finished audio in IndexedDB; `src/utils/captureSegments.ts` persists 1-second chunks during capture; `LaunchMemoryBridge.tsx:162-188` recovers both on reload/return. |
| **Recording starts in two taps** | GREEN | Persistent mic FAB + PWA shortcut `/launch/memory?record=1` + `LaunchMemoryBridge.tsx:288-303` auto-starts when arriving with `?record=1`. |
| **Auto-finish safeguards** | GREEN | Quiet-end detection via `useQuietEnd`; auto-stop at tier cap (`LaunchMemoryBridge.tsx:383-397`); global capture status banner so the user always knows it is listening. |
| **Actions-to-calendar wiring** | GREEN | `commitActions.ts` is the single shared path: writes `calendar_events` with `source: 'memory_bridge'` and `extracted_action_id`, reminders, invitations, and updates the action to `scheduled`. `scheduleFromMeeting.ts` uses it for one or many actions. |
| **Extraction pipeline** | AMBER | `processSavedRecording.ts` has robust polling and deduplication, but success still depends on edge functions + external transcription/AI. API config or quota errors produce graceful degradation (transcript kept, actions may be zero) but are not fully under our control. |
| **Mobile install & 3-click rule** | AMBER | `manifest.webmanifest` has icons, standalone display and shortcuts, but there is no verified service-worker/offline shell, and the home screen still carries many widgets that can dilute the 3-click promise. |
| **Daily habit surfaces** | AMBER | `QuietHome` has `DayOpenWelcome`, `NextActionStrip`, `ArriveAndArmCard`, `CompletionStatsStrip`, etc. — useful, but the cumulative surface is busier than the "max 3 primary choices" guardrail allows. |
| **Support Circle privacy & access** | AMBER | Roles and permissions exist (`support_circle_members`, `user_roles`), but ad-hoc loop-ins and watcher visibility need a final permissions audit to guarantee a support worker only sees what they are explicitly given. |
| **Offline functionality** | RED | Beyond the local recording safety net, the app does not work offline. No service worker caches routes or data; a dead connection blocks most daily actions. |
| **External calendar sync (Google/Outlook)** | AMBER | Edge functions and OAuth flows exist, but the end-to-end reliability has not been verified in production-like conditions. |

## 2. Investor-ready strengths (what can be promised today)

1. **The capture safety net is real.** Even if the phone is backgrounded, the tab reloads, or the session expires mid-capture, the audio is not lost. This directly addresses the memory-challenges use case.
2. **The action-to-calendar loop is deterministic.** One code path (`commitAction`) creates the event, reminders, invitations and updates the action record, so behaviour is consistent whether scheduling one action or all of them.
3. **Provenance is built in.** Every calendar event created from Memory Bridge carries `source: 'memory_bridge'` and the originating `extracted_action_id`, so a user can always trace a diary entry back to the conversation it came from.
4. **Consent and privacy are first-class.** Retention modes (Light Touch / Balanced / Full Record), explicit recording consent flow, and tiered deletion with undo-first design map to GDPR and clinical-data expectations.
5. **The app is installable as a PWA** with one-tap shortcuts for Capture, Today and Check in.

## 3. Fix-it priority list (what must harden before real-life daily use)

### P0 — must fix before friends testing
1. **Extraction reliability guard.** Add a dead-letter/retry queue for failed extractions and a visible "No actions found — help me fix it" path when the pipeline returns zero actions despite a good transcript.
2. **Permission audit for Support Circle.** Verify and, if needed, tighten RLS + application checks so a support member can only view the specific recordings/actions the owner explicitly shared.
3. **Home screen simplification.** Reduce `QuietHome` to one primary daily action, two secondary actions, and the rest behind "More" — enforcing the max-3-choices rule.
4. **Offline read-only shell.** Add a service worker that caches `/launch/home`, `/launch/calendar`, `/launch/memory` and the user's next actions so the app opens and shows today's plan even with no connection.

### P1 — close before wider launch
5. **End-to-end calendar sync verification.** Run real Google/Outlook OAuth flows and confirm events with `.ics` invitations land in external diaries and accept RSVP updates.
6. **Automated daily-habit smoke tests.** A Playwright script that: opens the app, taps Capture, records 10s, saves, waits for extraction, schedules an action, and verifies it appears on the calendar.
7. **Battery and background capture on mobile.** Test 30+ minute recordings on iOS Safari and Android Chrome; confirm wake-lock and segment persistence behave under real backgrounding.

### P2 — polish
8. **Smart "moment capture" for ad-hoc promises.** A 60-second lightweight capture mode that asks "Who promised what, by when?" and produces a single next step without the full meeting ceremony.
9. **Completion celebration polish.** Ensure finishing an action reliably triggers the celebration, updates stats, and notifies the Support Circle in one smooth sequence.
10. **Performance pass on home load.** Defer non-essential widgets and reduce initial bundle so the app feels instant on mid-range phones.

## 4. Implementation plan

Step 1 — Produce the written assessment report (`docs/reliability-scorecard.md`) with the scorecard, strengths and fix list above, plus file references.
Step 2 — Tighten Support Circle access: review RLS on `support_circle_members`, `extracted_actions`, `voice_recordings`, and add an application-level visibility helper if gaps are found.
Step 3 — Simplify `QuietHome`: keep `DayOpenWelcome`, `NextActionStrip`, and one primary CTA; move everything else behind progressive disclosure or a bottom sheet.
Step 4 — Harden extraction: add a retry queue table or edge-function retry, and a user-facing "rescue" card when extraction returns zero actions.
Step 5 — Add a minimal service worker for offline shell + cached next actions.
Step 6 — Write and run the daily-habit Playwright smoke test.
Step 7 — Verify on a real phone (iOS Safari + Android Chrome) and fix any capture/backgrounding issues.

## 5. Success criteria

- A user can install the app on their phone and reach the capture screen within 3 taps.
- A 10-minute recording can be started, backgrounded, resumed, saved and extracted without data loss.
- An extracted action can be scheduled and appears in the in-app calendar with a reminder.
- The home screen presents at most 3 primary choices.
- Support Circle members only see content explicitly shared with them.
- The app opens and shows today's plan when offline.
