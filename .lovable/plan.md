# One calm route: from conversation to my day

## The problem (our north star)
**Remembering, so follow-through can happen, and my vision becomes real.** People care deeply and mean every word. But after a brain injury, stroke, ADHD, dementia or burnout, what was said doesn't always stay. Without remembering, there's nothing to follow through on. MyRhythm remembers for them, then supports carrying each step through to done. **Remembering is the problem we solve; follow-through is what it gives back; a life I choose is where it leads. And no one walks alone.**

**From vision to today:** My Vision (the life I want at home, with family and at work) breaks into practical goals, then this week's priorities, then today's small steps. Every captured conversation can link a step to the vision it serves, so ordinary days visibly move me towards the life I chose.

After hospital, an appointment, a family plan or a **work meeting**, people with brain injury, stroke, ADHD, dementia or burnout lose what was said. Steps slip, **promises to family, colleagues and employers are missed**, and confidence wears away, so **being there for family and getting back to work** feels out of reach. Today's tools assume a brain that remembers to open, type, sort and follow up. MyRhythm does those jobs for them, so they can **show up, keep their word and take back their life, at home and at work**.

The journey it supports, in order:
1. **Home from hospital:** discharge and follow-up conversations become a plan that keeps going after the care stops.
2. **Back with my family:** school runs, birthdays, appointments for others, and the promises made at the kitchen table are kept, so I'm someone my family can count on again.
3. **Back to work:** return-to-work meetings, team meetings and one-to-ones become clear actions, owners and deadlines, timed around my energy.
4. **Keeping my word, every day:** every commitment, to my family, my colleagues and myself, is captured, scheduled, reminded and visibly done.

**No one walks alone.** My Support Circle (family, friends, colleagues, carers) is part of every step, on my terms. They see only what I choose, and they can cheer me on, take on a step, or gently prompt me. Remembering and follow-through are shared, never a burden I carry by myself.

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

### Never relying on memory to press record
- **Already built:** a prompt to record when you open the app during an appointment, automatic stop after quiet time, and saving as it goes, with a rescue offer next time.
- **New, a nudge before each appointment:** a notification on phone and watch 5 minutes before any appointment or meeting ("GP at 2pm. Tap to record."). One tap starts recording.
- **New, the calendar entry carries the link:** steps and appointments sent to the phone calendar include a "Tap to record with MyRhythm" link plus an alert, so the watch reminds you as well.
- **New, "Did I miss one?":** an evening note when an appointment passed with no recording, offering a 30-second voice note that still becomes next steps.
- **New, a supporter can prompt:** a Support Circle member with permission sends "Shall I start recording?". The owner still taps yes.
- **New, warm habit lines** after each saved conversation. No streaks and no guilt.
- **Guardrail:** never record without a visible tap. No hidden or always-on listening.

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

### No one walks alone, made visible
- **On the Conversation Summary:** a "My circle" strip shows who is in the loop, with faces or initials. One tap shares, already set to each person's permission.
- **On each step:** a quiet "With: Sarah" chip when someone is helping, and a heart when they've sent encouragement.
- **On Home:** a warm line such as "Sarah is cheering you on today" when there's a new note. Otherwise it's hidden, so it never adds clutter.
- **On the landing page:** "No one walks alone." is a signature line in the journey, in teal, beside the Support Circle.
- **Guardrail:** sharing is always the person's choice. Nothing is shared beyond the permissions they set.

## Brain-friendly rules every screen must pass
At most 3 choices, 56px buttons, 16px+ text, plain words in first person, no red error walls, no time pressure, nothing to remember, always undoable, no medical claims.

## Also in this plan
- Publish the current version to myrhythmapp.com (the security check is clear), so you can test the upload on your phone today.
- Update the landing page problem statement to the north-star wording above, in "you" voice, showing the four-step journey: home from hospital, back with your family, back to work, keeping your word.
- Family and work steps: the before-appointment nudge also covers family plans and work meetings, and steps involving a named family member or colleague keep that person as owner, so they can be shared.
- Add the "Capture → thinks → one yes" check to Test 10.

## Technical details
- Memory Bridge entry: reorder to Record first and Upload second, and add a first-run "one-tap recording" card (device-local flag) that reuses TapToRecordCard.
- After processing, route uploads and recordings to one Conversation Summary view built from the existing ExecutiveSummaryPanel, ActionsTableView and exportActionsXlsx. Add a single "Put these in my day" action using placementRule and the existing commit path, with undo.
- Gentle-day: read isGentleDay to limit the steps shown to 1.
- Publish with preview_ui--publish once approved.
- Still outside this plan (they need your approval or the email checks): Android Share target, Apple Shortcut endpoint, automatic summary email.
