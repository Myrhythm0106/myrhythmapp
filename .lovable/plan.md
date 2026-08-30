# Close the Loop: complete, notify, celebrate, count

Runs **before** "Ready for Friends Testing". Today a next step can be marked done, but nothing else happens: no one is told, nothing is celebrated, and no number moves. This makes finishing something feel like the moment it is.

## What happens today (verified)

- Marking a step done in the Next Step Summary sets status and archives the row (`ActionsViewer.handleStatusChange`). That is all.
- There is a celebration component (`src/components/launch/CompletionCelebration.tsx`) with confetti and a "share with support circle" note — it is not used from the actions table.
- There is a completion hook (`src/hooks/useActionCompletion.ts`) that notifies watchers — but the database function it calls reads watchers from `daily_actions`, not from `extracted_actions.assigned_watchers`, so next steps captured from a conversation never notify anyone.
- Reminders are cleared on archive, which is right and stays.
- No completion counts appear on Home.

## The loop, in order

```text
I tick it done
  -> the step closes cleanly (status, completion date, reminders stopped)
  -> the people I chose are told, in plain words
  -> I get a short, warm celebration - streak if I have one
  -> my numbers move on Home: done this week, streak, open steps
  -> I can undo it in one tap for 10 seconds
```

### 1. Close it properly
One completion path used everywhere (table, viewer, Commit page, Home): set status done, stamp completion date, stop the reminder ladder, archive, and offer Undo. No double-writes, no path that closes a step without running the rest of the loop.

### 2. Tell the right people, not everyone
Only those already attached to that step: watchers from my Support Circle, the owner's email, and anyone in the loop-in list. Message is plain and first-person-friendly: "Sarah finished: Book the follow-up appointment." Delivered as an in-app alert for circle members, and email for those with an email but no account. Nothing is sent for a step with nobody attached, and nothing is sent when I immediately undo.

### 3. Celebrate me
Reuse the existing celebration: what I finished, my current streak, a personal-best marker, and one optional line to share with my circle. Short, dismissible, respects reduced motion, never blocks the next thing. Milestones (first ever, 5th, 10th, weekly clean sweep) get a slightly warmer message — no confetti storm every single time.

### 4. Move the numbers
A quiet stats strip: **done this week**, **current streak**, **open steps**. Shown on Home and above the Next Step Summary. Counts come from real rows, update instantly on completion, and are honest when empty ("Nothing finished yet this week — one small step counts").

### 5. Undo means undo
Undo restores status, clears the completion date, un-archives, restores the reminder ladder, retracts the celebration, and marks any sent notification as withdrawn so no one is told twice.

## Guardrails

- Max three things on screen at once; celebration is one modal, then gone.
- No clinical or performance language. Confidence, follow-through, momentum.
- Support circle members only ever see the steps they were already attached to — enforced by database policy, not by the interface.

## Technical notes

- Single `useCompleteAction` hook: update `extracted_actions` (status, `completion_date`, `archived_at`), clear reminders, fire notification, return the data the celebration needs. `ActionsViewer.handleStatusChange`, `ActionsTableView`, `LaunchCommit` and Home all call it.
- Notification: new security-definer function that reads `extracted_actions.assigned_watchers`, `owner_email` and `adhoc_loop_ins` and writes `accountability_alerts` for circle members; email via the existing `send-email` function for email-only recipients. Existing `notify_watchers_of_action_completion` stays for `daily_actions`.
- Streaks: derive from completion dates on `extracted_actions` plus `daily_win_streaks` where it already exists; add a `completion_stats` read function rather than counting in the client.
- Celebration: reuse `CompletionCelebration.tsx`; add streak and milestone inputs, respect `prefers-reduced-motion`.
- Undo: keep the pre-completion snapshot in memory for the toast lifetime; a withdrawal flag on the alert row prevents duplicate notices.
- Migration needed for the notification function and stats function; policies reviewed so alerts are readable only by their intended recipient.
