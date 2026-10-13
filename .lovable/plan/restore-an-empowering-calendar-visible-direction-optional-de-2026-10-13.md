# Restore an empowering calendar — visible direction, optional detail

## The correction

**Keep the vision and all three targets in view. Hide the detail—not the purpose.**

The current day-view banner shows only the saved Core sentence when closed; Key and Stretch appear only after opening the editing fields. It also replaces the stronger banner treatment with a plain, bordered section. This revision restores the presence you preferred without restoring pressure or clutter.

## 1. My Vision in ACTion: a proper visual anchor

- Restore a distinctive, full-width vision banner: rich emerald/teal, readable contrasting text, restrained gold accents and a soft glass treatment, coordinated with /start. Not another plain block of green text.
- Keep **My Vision in ACTion**, the saved vision statement and **all three saved targets—Core, Key and Stretch—visible**, even when details are closed.
- Present the targets as three clearly separated columns on wide screens and three compact, readable rows on phones. Use gentle visual emphasis for Core; Key and Stretch remain equally legible rather than faded away.
- Show the selected day's targets—not an annual goal presented as today's task. Keep the vision statement above them so direction and today's contribution are visibly connected.
- Keep the actual target text readable, not clipped to fit a tiny tile. For unusually long text, offer an explicit way to read the full wording.
- Empty targets remain optional; no invented goals and no demand to fill all three.
- Preserve the gentle descriptions: **My main step towards my vision**, **Another step towards it**, **Only if I feel up to it**. Put these explanations in the details rather than repeating them in the compact banner.

## 2. Hide editing and explanation—not the three targets

- **Show details / Hide details** opens or closes the editable fields, fuller explanations and existing vision-connection check.
- The banner, vision and three target summaries stay visible in both states. Avoid showing each target twice when expanded: its summary becomes its editing field in the same position.
- Keep **Help me plan** clearly available in the banner in either state.
- Retain the Settings choice **Vision in ACTion details: Start closed / Start open**. It controls supplementary detail, never whether the vision and targets are visible.
- No rotating encouragement, compulsory daily confirmation, performance gauges or added brain scores.

## 3. Today’s Priorities: a separate, calm schedule

- Below the vision banner, keep **Today’s Priorities** as the everyday area, with clear spacing and a restrained neutral surface so the two purposes are easy to distinguish.
- Retain the existing calendar items and their real times. Keep chosen priority stars on those original items; do not create another duplicate task list.
- Everyday action titles and times stay visible. Additional notes and existing editing controls can be opened when needed rather than becoming extra text on every item.
- Preserve the original schedule order and existing completion, rescheduling and reminder controls. An everyday priority does not need to serve the vision.
- Do not label every appointment as a chosen priority: use a small **My schedule** subheading for the full timed list, with stars identifying the person's highlighted priorities.

```text
MY VISION IN ACTON                           Help me plan
My vision: [saved statement]

Core                     Key                    Stretch
[today's saved target]   [today's saved target]  [optional target]

Show details                                                   ˅
────────────────────────────────────────────────────────────────
MY DAILY RHYTHM

09:00  [everyday appointment]                  ☆
11:00  [chosen everyday priority]              ★ Priority
```

This is a layout illustration only; it does not add sample commitments to anyone's calendar.

## Technical scope

- Revise `LaunchCommitmentBanner` and the surrounding day-view presentation; retain existing planning storage, dates, saved text, AI assistance and confirmed vision relationships.
- Keep old saved content without inventing a relationship to the vision. Preserve the existing connection check inside optional detail.
- Reuse the existing detail preference and event highlights. No new database changes, scheduling rules or cross-device promises.
- Use semantic theme tokens and existing controls for the richer banner treatment, with readable contrast, at least 16px body text and 56px primary touch targets.
- Leave Home, assessment, membership, recording and Support Circle unchanged.
- During implementation, update the saved design preference to reflect this correction: all three target summaries remain visible; only supplementary details start closed.

## Acceptance checks

- Closed view visibly contains the vision and all three saved targets; expanded view does not repeat them unnecessarily.
- Everyday priorities remain visually separate and readable without opening vision details.
- Compare the actual calendar on wide desktop and narrow phones, including long text, empty targets and busy days; no overlap, sideways scrolling or hidden buttons.
- Confirm both Settings choices, manual opening/closing and editing preserve saved text and the selected date.
- Confirm Help me plan remains accessible and starred priorities do not alter appointment times or vision targets.
- Check the signed-in saving and planning flow where access permits; report any unavailable checks rather than claiming they passed.

**Success:** the calendar feels purposeful and professional again—you can see what you are working towards and what needs attention today, without facing every detail at once.