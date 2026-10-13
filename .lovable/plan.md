# A calmer focus reminder — present, without pressure

## Recommendation

**Keep the direction visible; reveal the detail only when wanted.** This is better than either displaying three demands at once or hiding the whole reminder. It provides a memory cue without asking the person to process their whole plan each time they open the calendar.

The current calendar focus section shows Core, Key and Stretch together. Core is described as “This is non-negotiable”, and encouragement changes every eight seconds. These can feel demanding or distracting. A calmer presentation should be steady, personal and optional.

No design will feel right to everyone. The strongest starting point is a quiet default, clear choice and testing with people who experience memory difficulties.

## What the person sees

- A compact, unframed **Today’s focus** section, closed by default.
- Their saved Core focus remains visible as a readable sentence—not just an icon or a clipped label.
- Show the person’s saved vision as a quiet **Working towards** line, with today’s priority visually stronger beneath it. Vision is the direction; the priority is what matters now. Showing both is context, not proof that they are linked.
- Show **This supports my vision** only when the person has explicitly chosen that relationship. Never invent a connection or infer it from the wording alone.
- A clearly labelled **Show my focus details** control with a chevron opens the three editable fields. **Hide my focus details** closes them.
- If no focus is saved, show **What matters to me today?** rather than an empty three-field form. Opening it allows the person to set their focus.
- Keep **Help me plan** accessible while closed; it must not require searching inside the details.

Illustrative presentation—not invented user data:

```text
Working towards: [My saved vision, when available]
Today’s focus
[My saved priority — more prominent than the vision line]
[This supports my vision — only when chosen]

Show my focus details                         ˅
Help me plan
```

## Vision and everyday priorities: two roles, not two competing lists

- **Vision answers “Where do I want to get to?”** Keep just one quiet reminder; longer vision text opens on request rather than filling the calendar.
- **Today’s focus answers “What matters most today?”** It can be a step towards the vision or simply something life needs today. Both are valid.
- In expanded details, offer an optional **Link to my vision** checkbox for the Core priority. No extra mandatory question, no new daily category picker, and no forced goal connection.
- An unlinked priority needs no warning or badge. For example, collecting a prescription can be today’s priority even if the person’s vision is reconnecting with friends.
- Leave appointments and reminders in the calendar below; do not duplicate them into another checklist or automatically replace the person’s chosen priority with the next appointment.
- With no saved vision, show today’s priority normally and place an optional **Add my vision** link in the details. A vision is not required to use the app.
- Changing the priority clears any previously confirmed connection until the person chooses it again. Changing the vision must not silently reassign an old connection.

This makes the relationship visible without displaying the full Vision → Goals → Priorities → Actions hierarchy on every visit. No new progress percentages or claims of improvement are introduced.

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

Apply this first to the existing day-view Today’s Focus section. The shared section supports other periods, so keep those supported without adding new focus sections to week/month screens. Leave the separate annual vision editor and Home’s single-priority layout unchanged.

## The brain-health connection

The value is **less information to hold in mind, with a visible reminder of what matters**—not a promise to improve or treat the brain. Do not add a brain score or another assessment to this section. Any existing energy-aware planning remains a suggestion the person can edit, not a rule.

Describe this rationale in product explanations if needed, not as extra instructional text crowding the calendar. Preserve the app’s non-medical disclaimers.

## Technical details

- Update `LaunchCommitmentBanner` with an accessible expandable details section, keeping its existing saved planning data and AI planning flow.
- The reads show two separate vision sources: the My Vision page saves its statement locally, while calendar planning stores `vision_text` in `planning_scopes`. The day-view breadcrumb currently relies on inherited props. Do not present that breadcrumb as a verified goal link.
- Reuse the statement saved by the actual My Vision page for this calendar reminder through a shared reader; explicitly fall back to an existing calendar vision only when no statement exists. Preserve both sources without overwriting or migrating them in this presentation change.
- Remember the optional user-confirmed connection locally, scoped to the signed-in person, planning date and the exact priority/vision it refers to. Do not add permissions, database migrations, automatic semantic matching or cross-device claims. Recheck the stored texts before displaying a connection.
- Replace the duplicate day-view vision breadcrumb with this single integrated reminder so the calendar does not show two competing vision areas.
- Add the display preference to Launch Settings using the existing device-local preference approach, safely defaulting older saved preferences to closed. Do not promise cross-device synchronisation.
- Use existing design components and semantic Light Linen tokens; maintain 16px body text, large touch targets, keyboard support, announced expanded/collapsed state and reduced-motion support.
- No changes to assessment scoring, recording, membership, Support Circle permissions or scheduling decisions.

## Checks before completion

- Verify closed and open states on narrow phones and desktop, including long focus/vision text and empty plans.
- Verify edits still save, collapsing does not discard edits, and reopening shows saved values.
- Verify Help me plan can be opened and a draft accepted while the details are closed; the visible focus then updates.
- Verify both Settings choices survive a refresh on the same device and switching calendar periods displays the correct saved focus.
- Verify linked and unlinked priorities, a missing vision, an edited vision, and an everyday urgent priority. Only an explicitly confirmed, still-current connection may say it supports the vision.
- Verify the calendar reads the statement the person saved on My Vision, not an unrelated or stale inherited label.
- Verify navigation, the mic and the calendar remain accessible without overlap.
- For reception testing, ask a few intended users: “What matters today?”, “Where would you change it?” and “Does this feel encouraging or demanding?” Treat that feedback—not assumptions—as the test of warmth and ease.