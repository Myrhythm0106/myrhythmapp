# Plan v7.17 — Support Circle + MVP Conversion Hooks

## Goal
Close two gaps the user just flagged:
1. **No way to add people / Support Circle** in the prototype flow.
2. **Not gripping enough to buy** — missing the emotional + proof hooks.

Scope: prototype only (`/prototype/*`). No DB, no `/launch/*` changes, no edge functions.

---

## Part A — Support Circle in the prototype

### A1. New session-scoped store: `prototypeSupportCircle.ts`
```
PrototypeCircleMember {
  id, name, relationship ('partner'|'family'|'friend'|'clinician'|'caregiver'|'other'),
  role ('cheerleader'|'accountability'|'logistics'|'clinical'),
  notifyByDefault: boolean
}
```
Helpers: `loadCircle / saveCircle / addMember / removeMember / suggestForAct(act)`.

### A2. Assessment step adds a 6th screen
After Support Style, ask: *"Add 1–2 people to your circle now? (optional, skippable)"* — 2 quick rows: name + relationship + a chip for role. Skip = empty circle.

### A3. New "Circle" chip in `PrototypeLayout` header
Small badge showing `n` people, opens a sheet to add/remove. Available on every prototype screen so users can add people anytime.

### A4. Review screen — per-action "Invite" affordance
On each action card, a subtle `+ invite` button → mini-picker of circle members → writes to `act.shareWith`. Auto-suggest based on act type:
- `medication`, `follow_up`, `test` → clinical role members
- `lifestyle`, `homework` → accountability role
- High-priority actions → notifyByDefault members preselected

### A5. Schedule screen — show who's looped in
On each scheduled block, render avatar initials of `shareWith`. "How this was decided" line gains: *"…and we suggested looping in <Name> because they're your accountability partner."*

### A6. Done / Reminders screen — circle preview message
Show the exact (mocked) message that would go out: *"Sarah will get a heads-up 10 min before your 10:00 focus block."* Reinforces the "I'm not alone" hook.

---

## Part B — Conversion hooks (the "want to buy" gap)

### B1. Hook 1 — Belonging (covered by Part A)
The Support Circle is the belonging hook.

### B2. Hook 2 — Proof / payoff on the Done screen
Rebuild `PrototypeDone.tsx` from a flat thank-you into a **"Your week, transformed"** summary:
- Big number: `N actions captured in 90 seconds`
- `N scheduled in your best focus window (late morning)`
- `N protected from your low-energy window (afternoon)`
- `N people looped in` (only if circle > 0)
- Streak seed: *"Day 1 of your rhythm. Day 7 unlocks your first weekly review."*

### B3. Hook 3 — A keepable artifact
Add a **"Save my week"** button on Done that downloads a clean PNG/PDF "Week on a Page" (vision strip on top, scheduled actions, energy windows colored). Uses existing canvas/export pattern. Gives the free trial a tangible takeaway.

### B4. Landing reinforcement
Add one new pain→relief card on `PrototypeLanding.tsx`:
*"You don't have to do this alone."* → *"Loop in family, friends, or your care team — only when it helps."*
And add one value tile: *"Built for you — and the people standing with you."*

---

## Part C — Acceptance criteria
- Assessment now has 6 steps, last one optional.
- Header Circle chip visible on every `/prototype/*` screen.
- Review screen lets me attach a circle member to any action in ≤ 2 taps.
- Schedule screen shows initials of attached members on each block.
- Done screen shows the "transformed week" summary and a working "Save my week" download.
- Landing has the new belonging messaging.
- All copy honors the no-diagnosis disclaimer.

---

## Out of scope
- No real invites/emails (mocked preview only).
- No Supabase tables, no `support_circle_members` writes.
- No changes to `/launch/*`, `TBICalendarApp`, or MVP code.
- No payments wiring (separate decision).

## Files touched (estimate)
- new: `src/prototype/prototypeSupportCircle.ts`
- new: `src/prototype/CircleChip.tsx`, `src/prototype/CircleSheet.tsx`
- edited: `PrototypeAssessment.tsx`, `PrototypeLayout.tsx`, `PrototypeReview.tsx`, `PrototypeSchedule.tsx`, `PrototypeDone.tsx`, `PrototypeLanding.tsx`, `prototypeStore.ts` (attach helper), `prototypeAssessment.ts` (step count)
