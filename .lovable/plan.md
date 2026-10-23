# One calm route: from conversation to my day

## The problem (our north star)
After an appointment, discharge or important conversation, people with brain injury, stroke, ADHD, dementia or burnout lose what was said, the steps slip, and confidence wears away. Today's tools assume a brain that remembers to open, type, sort and follow up. MyRhythm does those jobs for them.

## The design: three moments, one decision
```text
1 CAPTURE            2 MYRHYTHM THINKS               3 ONE YES
tap to record   ->   summary + next steps     ->   "Put these in my day?"
(phone, watch,       named, dated, owners           Yes / Let me check
 back tap, upload)   no questions asked             then shared + reminded
```

### 1. Capture: one tap from anywhere
- A big **Record** button opens first on Memory Bridge, with **Upload a recording** under it as a quiet second choice.
- Back Tap, the home-screen shortcut and watch voice memos all lead to the same place.
- The first time, a short card asks "Set up one-tap recording?" and walks through it in 3 steps. It's never shown again once done.

### 2. MyRhythm thinks: no forms
- Recordings are named, written up and turned into steps automatically.
- A calm progress line ("Saved · Writing it up · Your next steps are ready"), with no spinning wheel to watch.
- If something fails, one sentence explains what happened, with one **Try again** button. Nothing is lost.

### 3. One yes: the Conversation Summary card
- The top of the card shows the **key summary**: 3 to 5 plain points, the date and the reference code.
- Below that, the **steps table** (Action, Who, When, Priority) in a clean spreadsheet style, with Excel download.
- One main button: **Put these in my day**. It follows your saved control choice and can always be undone.
- A second button: **Share** (owners and Support Circle, ticked already, permission-safe).
- On a gentler day, it shows only the first step.

### Three kinds of step, clearly labelled
| Kind | What it means | Default | Choice |
|---|---|---|---|
| **Agreed** | Said out loud in the conversation, with the quote shown | Ticked | Untick to drop |
| **Implied** | Clearly expected but not said, with a one-line reason | Not ticked | **Keep** / **No thanks** |
| **Ideas** | Helpful extras linked to the topic, at most 3 | Not ticked | **Add** / **No thanks** |
- A **Keep all** shortcut covers everything, and any choice can be changed afterwards.
- Only accepted steps reach the diary, the email or sharing.
- It learns your taste: if you turn down ideas often, fewer are offered. Settings has "Show ideas: on / off".
- Ideas never give medical advice. Health items are worded as "Ask your care team about…".

## Brain-friendly rules every screen must pass
At most 3 choices, 56px buttons, 16px+ text, plain words in first person, no red error walls, no time pressure, nothing to remember, always undoable, no medical claims.

## Also in this plan
- Publish the current version to myrhythmapp.com (the security check is clear), so you can test the upload on your phone today.
- Update the landing page problem statement to the north-star wording above (in "you" voice).
- Add the "Capture → thinks → one yes" check to Test 10.

## Technical details
- Memory Bridge entry: reorder to Record first and Upload second, and add a first-run "one-tap recording" card (device-local flag) that reuses TapToRecordCard.
- After processing, route uploads and recordings to one Conversation Summary view built from the existing ExecutiveSummaryPanel, ActionsTableView and exportActionsXlsx. Add a single "Put these in my day" action using placementRule and the existing commit path, with undo.
- Gentle-day: read isGentleDay to limit the steps shown to 1.
- Publish with preview_ui--publish once approved.
- Still outside this plan (they need your approval or the email checks): Android Share target, Apple Shortcut endpoint, automatic summary email.
