# Award-readiness review: interest to working reminders

## Verdict
The core loop exists and is strong in places: recordings recover after interruption, review groups actions clearly, the diary receipt has Undo, and Done closes the loop. But it does not yet meet the bar of "reliable, dependable, organised, in control". Three cracks break trust: the landing promises a different setup from the one people get; scheduling success can hide missing reminders; and reminders are not proven to arrive when the app is closed. For someone with memory challenges, a reminder that never arrives is the worst possible failure.

## Stage-by-stage findings (confirmed in code)

| Stage | What works | What breaks trust | Fix |
|---|---|---|---|
| 1. Interest (landing) | Two clear buttons, warm images | Copy promises "4 short steps... questions... free snapshot"; real path is account, card, Home | Rewrite to "2 steps: create account, add card. Then you're in." |
| 2. Register + card | Short, inline errors, resend email | Email confirmation detour can lose people | Keep auto-confirm; one calm "Check your inbox" screen with resend and "Open mail" |
| 3. Welcome | 3 panels, Guide me / Explore | Closing the welcome hides the My first loop card; person is left with "Pick up my welcome" | Show the first-loop card when welcome is finished OR dismissed |
| 4. First recording | Auto-start, timer, local recovery, Save again | No "everyone knows this is recorded" moment; "Stop and save" needs a second Save; retry wording differs ("Extract actions" vs "Find my next steps") | One-line consent check before first recording (remembered); Stop saves straight away; one label everywhere: "Find my next steps" |
| 5. Report | Clear brief, export | "Couldn't find this capture" with only Back while still processing; Share only downloads | "Still working on it" state with auto-refresh and Try again; Share opens the phone's share sheet, download as fallback |
| 6. Actions extracted | Agreed / guidance / ideas groups | Higher-confidence inferred items preselected; edits lost on "Not yet"; empty result says nothing about the conversation | Only agreed items preselected; keep edits as draft; always show a 3-line summary even with no actions |
| 7. Into diary | One Schedule button, receipt, Undo | Missing times block scheduling and need manual picking; Undo can claim success after failure; reminder save errors are ignored | "Suggest times for all" fills gaps from peak hours in one tap; Undo reports real result; scheduling only says "done" when diary, reminder and link all saved |
| 8. Reminders | Get-ready, Done/Snooze, one follow-up, 18:00 Still open | No server schedule found, so nothing fires when the app is closed; "push" is only an in-app record; failed sends marked sent; yesterday's open items vanish | Scheduled job every minute; real delivery by email first (phone notifications next); mark sent only on success, retry once; carry yesterday's open items into Still open |

## The award moment to protect
Conversation -> confirmed steps -> in the diary -> reminded on time -> Done -> loop closed, with the person in control at each step. Every fix above serves that single line.

## Build order
1. Reminders that truly arrive (scheduled job, email delivery, honest sent status, carry-over of yesterday). Change "Nothing else to do now" only once delivery is proven.
2. Scheduling integrity: all-or-nothing save with honest message; Undo checks results.
3. One-tap "Suggest times for all"; only agreed actions preselected; drafts kept.
4. Recording: consent line, Stop saves, single wording.
5. Report: processing state with retry; phone share sheet.
6. Welcome dismiss still shows first-loop card; first-loop links open the right recording.
7. Landing copy matches the 2-step reality.
8. End-to-end test on a real phone: record, schedule for 10 minutes ahead, lock the phone, confirm the reminder email arrives on time, tap Done.

## Technical details
- Cron: pg_cron + pg_net calling `send-scheduled-reminders` every minute; needs the function deployed and Resend key confirmed in secrets.
- `send-scheduled-reminders`: set sent only after channel success; record failure and retry once; default channel email until web push exists.
- `commitActions.ts`: check reminder insert and action-link update errors; roll back calendar row on failure.
- `CommitSummarySheet.tsx`: Undo inspects errors.
- `useReminderEngine.ts` / `StillOpenList.tsx`: include unresolved items from earlier days.
- `ReviewStep.tsx` / `reviewGroups.ts`: preselect only category agreed; draft persistence; bulk slot fill via `suggestSlots.ts` (tested).
- `QuietHome.tsx`: render FirstLoopCard when induction finished or dismissed; `firstLoop.ts` links carry recording id.
- `CaptureDeliverableView.tsx`: processing/poll state; `navigator.share` with file fallback.
- `MVPCore4C.tsx`: landing step copy.
- Tests: reminder sent-status rules, preselection rule, carry-over rule.

## Open dependency
Closed-app delivery needs the scheduled job and email provider working on your Supabase project; I verify this in step 1 and tell you plainly if anything needs you.
