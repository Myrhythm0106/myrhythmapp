# Memory Bridge: friction pass, invites, and MVP readiness

## What I checked (current state, verified in code)

- Recording, saving and AI action extraction run end to end (`LaunchMemoryBridge` → `process-meeting-audio` / `extract-acts-incremental` → `extracted_actions`).
- The Capture Brief page already lays actions out professionally (summary, decisions, questions, actions, transcript toggle) with PDF/DOCX/XLSX/clinician exports.
- Scheduling one at a time works (`SmartCommitSlot` → creates a calendar event, reminders, invitations, and updates the action).
- Bulk scheduling works ("Accept all recommended" → `commitAllRecommended`).

## Confirmed gaps to fix

1. **Invites are silent.** Committing an action writes rows into `event_invitations` but nothing ever emails the invitee. Nobody outside the app finds out they were invited.
2. **You can't add a person yourself.** The "Who knows?" row only shows people the AI detected in the transcript. There is a working Support Circle picker (`LoopInPicker`) that is not wired into the action card, and no way to type an email for someone outside the circle.
3. **Bulk scheduling drops the people.** After "Accept all", the on-screen cards show no invitee/watcher chips even though the commit sent them, so it looks like nothing happened.
4. **Capture Brief is desktop-shaped.** Four export buttons in the header, a 320px sidebar and 40px page padding make it cramped and fiddly on a phone.
5. **No confirmation of what just happened.** After scheduling there is no single "here's what's now in your diary and who was told" summary.

## What I'll build

### A. Friction removal
- Mobile-first Capture Brief: collapse the four export buttons into one "Share / Export" sheet, move section toggles into a bottom sheet on small screens, reduce padding, single column below `lg`.
- One clear primary action per action card; secondary controls (milestones, health-aware, due lock) tucked behind a "Fine-tune" disclosure so the default view is Date · Time · Who · Schedule.
- After scheduling (single or bulk), show a compact confirmation strip: date/time, reminders set, who was invited, who is watching, with Undo.

### B. Who's involved, done properly
- Add a "Add someone" control to every action card, opening the existing `LoopInPicker`: pick Support Circle members, or type any email address for a one-off guest.
- Each person gets a role: **Invite** (gets a calendar invite and an email), **Watch** (sees the action and its progress), or **None**.
- Support Circle members keep their richer rights — a watcher can open the action, add a note, and nudge/mark-seen; a plain email guest only gets the invitation. This follows the permissions already stored on `support_circle_members`.

### C. Invitations that actually arrive
- Send an email through the existing Resend-backed function whenever an invitation is created (single commit and bulk commit), containing the action, date/time, who invited them, and an `.ics` attachment so it drops into their own calendar.
- Watchers on the Support Circle get a lighter "you're now following X" notification rather than a calendar invite.
- Failures surface as a visible warning on the card rather than silently succeeding.

### D. Bulk path parity
- "Schedule all recommended" carries reminders and people through, then updates each card with the same confirmation strip, so bulk and one-at-a-time end in the identical state.

## Technical notes

- New edge function `send-event-invitation` (Resend, `.ics` generation, CORS, JWT validated in-code) invoked from `commitActions.ts` after the `event_invitations` insert; non-blocking with per-invite error reporting.
- `commitActions.ts` returns invited/watcher results so `SmartCommitSlot` and `CaptureBriefPreview` can render the confirmation strip; `commitAllRecommended` passes the same payload.
- `PersonPick` gains an ad-hoc variant (email + name, no `memberId`) so guests outside the Support Circle can be invited; watcher role stays restricted to real Support Circle members.
- No schema change required — `event_invitations`, `event_reminders`, `calendar_events.watchers` and `extracted_actions.assigned_watchers` already exist.
- Responsive work stays in the Capture Brief presentation components.

## Answering your questions 3 and 4

**Is it MVP-ready?** After this pass, yes for a friends-and-family cohort: capture → brief → schedule → remind → involve others is complete and closes the loop. It is not yet ready for rehab-centre distribution — that needs the clinician co-sign flow and the continuity report signed off.

**Can you use it in real life now?** Yes, with two caveats worth knowing before you rely on it: transcription accuracy on long, multi-speaker recordings will need your review before you trust the extracted actions, and until the invite email ships (item C) anyone you invite won't hear about it. Everything you commit for yourself — calendar entries, reminders, exports — is real and usable today.
