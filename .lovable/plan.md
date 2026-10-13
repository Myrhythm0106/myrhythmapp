# A calmer focus reminder — present, without pressure

## Recommendation

**Keep the direction visible; reveal the detail only when wanted.** This is better than either displaying three demands at once or hiding the whole reminder. It provides a memory cue without asking the person to process their whole plan each time they open the calendar.

The current calendar focus section shows Core, Key and Stretch together. Core is described as “This is non-negotiable”, and encouragement changes every eight seconds. These can feel demanding or distracting. A calmer presentation should be steady, personal and optional.

No design will feel right to everyone. The strongest starting point is a quiet default, clear choice and testing with people who experience memory difficulties.

## What the person sees

- A compact, unframed **Today’s focus** section, closed by default.
- Their saved Core focus remains visible as a readable sentence—not just an icon or a clipped label.
- A short goal/vision connection stays visible when a real saved connection exists. Use the existing calendar vision context; never invent a connection or claim an action supports a goal without evidence.
- A clearly labelled **Show my focus details** control with a chevron opens the three editable fields. **Hide my focus details** closes them.
- If no focus is saved, show **What matters to me today?** rather than an empty three-field form. Opening it allows the person to set their focus.
- Keep **Help me plan** accessible while closed; it must not require searching inside the details.

Illustrative presentation—not invented user data:

```text
Today’s focus
[My saved focus]
Working towards: [My saved goal or vision, when available]

Show my focus details                         ˅
Help me plan
```

## Make the expanded view warmer

Retain the familiar Core / Key / Stretch structure, with gentler descriptions:

- **Core — What matters most to me**
- **Key — Another important step**
- **Stretch — Only if I feel up to it**

All three remain optional. Stop rotating encouragement automatically in this section. Keep the /start standard: restrained, adult, warm and professional, with no flashing attention cues or extra decorative brain graphics.

## Settings: my choice, remembered

Add one simple **Focus details** choice:

- **Start closed** — recommended default; the focus reminder remains visible.
- **Start open** — show the full focus when entering the calendar.

The person can still open or close it at any time. These are starting preferences, not locks. Keep manual changes while moving between calendar views during the current visit; apply the saved starting choice on a fresh visit. Changing Settings takes effect immediately.

Apply the same behaviour to the existing day, week and month focus section, with its current period label and saved content. Leave the separate annual vision editor and Home’s single-priority layout unchanged.

## The brain-health connection

The value is **less information to hold in mind, with a visible reminder of what matters**—not a promise to improve or treat the brain. Do not add a brain score or another assessment to this section. Any existing energy-aware planning remains a suggestion the person can edit, not a rule.

Describe this rationale in product explanations if needed, not as extra instructional text crowding the calendar. Preserve the app’s non-medical disclaimers.

## Technical details

- Update `LaunchCommitmentBanner` with an accessible expandable details section, keeping its existing saved planning data and AI planning flow.
- Reuse the calendar’s existing saved vision context for truthful context where available; do not introduce new goal inference or scoring.
- Add the display preference to Launch Settings using the existing device-local preference approach, safely defaulting older saved preferences to closed. Do not promise cross-device synchronisation.
- Use existing design components and semantic Light Linen tokens; maintain 16px body text, large touch targets, keyboard support, announced expanded/collapsed state and reduced-motion support.
- No changes to assessment scoring, recording, membership, Support Circle permissions or scheduling decisions.

## Checks before completion

- Verify closed and open states on narrow phones and desktop, including long focus/vision text and empty plans.
- Verify edits still save, collapsing does not discard edits, and reopening shows saved values.
- Verify Help me plan can be opened and a draft accepted while the details are closed; the visible focus then updates.
- Verify both Settings choices survive a refresh on the same device and switching calendar periods displays the correct saved focus.
- Verify navigation, the mic and the calendar remain accessible without overlap.
- For reception testing, ask a few intended users: “What matters today?”, “Where would you change it?” and “Does this feel encouraging or demanding?” Treat that feedback—not assumptions—as the test of warmth and ease.