# Actions → Dates → Reminders: close the loop

## Where it stands today

Partly linked. There are two reminder systems, and only one of them actually fires.

1. **Calendar reminders (working).** When next steps are committed to the diary, each event gets minute-based reminders based on priority and how soon it's due. A cron job runs every 5 minutes and calls the reminder sender, so these do go out.
2. **The new next-step ladder (not firing yet).** The 7/5/3/1-days-before → due → 1/3/5/7-days-late ladder is wired in the UI: the picker saves rows, and changing a finish date shifts the reminder timestamps with it. But the `action_reminders` table is empty, nothing creates a ladder automatically, and there is **no scheduled job calling the new sender** — so even if rows existed, nothing would deliver them.

So: date changes are linked to reminders, but reminders are not yet linked to delivery, and no action gets a ladder unless I open the menu and set one by hand.

## What to build

### 1. Turn the ladder on
Add a scheduled job (every 15 minutes) that calls the new next-step reminder sender, matching the existing calendar reminder job.

### 2. Give every dated next step a ladder automatically
- When a next step is committed to the diary, or a finish date is set/changed on a step that has no ladder yet, create the default ladder for its priority (high → Strong, medium → Steady, low → Gentle).
- Keep it silent: no extra dialog, no extra tap. The menu stays available to change or switch it off.
- Steps with no finish date get no ladder — nothing to count down to.

### 3. Stop reminders when the step is done
- Completing, cancelling or archiving a step clears its pending reminders instead of leaving them to be skipped at send time.
- Restoring a step to open rebuilds the ladder from its finish date.

### 4. Make it visible
- A small bell on each row in the next-step table showing the ladder in force (Gentle / Steady / Strong / off) and the next reminder date, so the link between date and reminder is obvious at a glance.
- Reminders arrive through the existing in-app notification toast, so no new surface is needed.

## Technical notes

- New cron entry via migration calling `send-action-reminders` (function and config already deployed).
- Auto-ladder created in `scheduleFromMeeting.ts` (commit path) and in the finish-date handler in `ActionsViewer.tsx`, using `presetForPriority` and `saveActionReminders` from `src/utils/reminderLadder.ts`.
- Add `clearActionReminders(actionId)` to `reminderLadder.ts`; call it from the archive/status handlers; rebuild on restore.
- Row badge reads offsets via a light per-page batch query rather than one call per row.
- Calendar-event reminders stay as they are — the two layers are complementary: minutes-before on the day, days-around for follow-through.
