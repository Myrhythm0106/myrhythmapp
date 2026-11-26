# One clear journey for every person who uses MyRhythm

## The problem
Each piece works, but people meet them as separate rooms: welcome, induction, Home, Record, report, diary, reminders, Circle, Vision. Nothing tells them "you are on step 3 of 5, next is this". New users, especially after brain injury, may stop.

## The fix: one spine, five voices
Every role walks the same five steps. Only the wording and first suggestion change.

```text
1 Get in      ->  2 Capture   ->  3 Confirm     ->  4 Diary      ->  5 Follow through
(account,card)    (record or      (summary,        (times that      (reminders, Done,
                  upload)         actions)         suit my energy)  Circle told)
```

## The flow for each role

**1. Rebuilding after brain injury**
Get in -> "Record my first appointment" -> plain summary, Agreed actions (Implied and Ideas need a tap to accept) -> placed at peak-energy times -> get-ready prompt, Done or Snooze, one gentle follow-up, Still open at 18:00 -> optional: Circle sees it done; link to My Vision later.

**2. Supporting someone (carer)**
Get in -> choose "for someone I support" -> record an appointment or family conversation -> summary and actions split by who owns them -> their diary and mine, with their permission -> I am told when steps are done; Circle diary view only shows what they share.

**3. Too much in my head (stress, overwhelm)**
Get in -> "Clear one thing from my head" (voice note) -> one next step, not a list -> one slot today -> one reminder -> Done, with a calm "one less thing" message. Gentler day option always one tap away.

**4. Staying sharp at work (executive)**
Get in -> "Record my first meeting" -> decisions, owners, deadlines in the action table -> schedule mine, email others -> before-meeting prompt, Still open list -> share the summary with colleagues.

**5. Student / learner**
Get in -> "Record a lecture" -> notes and dates -> study blocks in diary -> reminders to done.

## What changes in the app
1. **"My first loop" tracker on Home**: replaces the long induction with one card showing the five steps above, ticking each one as it really happens (first recording, first confirmed action, first diary item, first Done, Circle invited). Always shows a single "Next: ..." button.
2. **Every step hands over to the next**: after a recording the report ends with "Confirm my next steps"; after confirming, "Put them in my diary"; after scheduling, "You'll get a gentle prompt at 9:40. Nothing else to do." No dead ends.
3. **Role picked once, then used everywhere**: the "who it's for" choice sets Home wording, the first recording suggestion, report language and reminder tone. Skipping keeps neutral wording.
4. **Induction trimmed** to: welcome, who it's for, Guide me / Explore, then the tracker takes over. Circle, snapshot and Vision become later "When you're ready" steps after the first Done, so nothing new is asked before value is felt.
5. **Where am I strip**: a small "Step 2 of 5: Confirm" line on Record, report and diary screens while the first loop is unfinished; disappears afterwards.
6. **One-page flow guide** (PDF in Help, and in your Files) showing all five roles on one page, for your testers.

## Technical details
- New `src/launch/onboarding/firstLoop.ts` (tested): derives step completion from existing saved rows (meeting_recordings, actions, calendar_events, reminder status, circle members); no new tables.
- `FirstLoopCard` on QuietHome; `LaunchInduction` reduced to 3 steps, existing progress migrated.
- Role copy extended in `journeyCopy.ts` for report, scheduling and reminder lines.
- Handover buttons added to report, action confirmation and scheduling confirmation.
- AGENTS.md induction rule replaced; roadmap updated.
