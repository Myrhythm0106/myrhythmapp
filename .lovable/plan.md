# A calmer focus reminder — present, without pressure

## Recommendation

**Keep vision focus and everyday priorities distinct.** Rename the current Today’s Focus section **My Vision in Action**, keeping its Core, Key and Stretch details closed by default. Everyday tasks belong under **Today’s Priorities** within the existing calendar. Neither should masquerade as the other.

The current calendar focus section shows Core, Key and Stretch together. Core is described as “This is non-negotiable”, and encouragement changes every eight seconds. These can feel demanding or distracting. A calmer presentation should be steady, personal and optional.

No design will feel right to everyone. The strongest starting point is a quiet default, clear choice and testing with people who experience memory difficulties.

## What the person sees

- A compact, unframed **My Vision in Action** section, closed by default. Avoid “Today’s focus” for this area because it sounds like a daily task list.
- Their saved Core focus remains visible as a readable sentence—not just an icon or a clipped label.
- Show the person’s saved vision as a quiet **My vision** line, with their saved Core vision focus beneath it. This area is exclusively for the direction they want to work towards—not everyday errands.
- Existing Core/Key/Stretch text may have been used for daily tasks under the old label. Preserve it, but do not retroactively claim a vision link. Let the person confirm or revise the connection in expanded details.
- A clearly labelled **Show my focus details** control with a chevron opens the three editable fields. **Hide my focus details** closes them.
- If no vision focus is saved, show **My next step towards my vision** as the invitation in the details, rather than an empty three-field form on first view.
- Keep **Help me plan** accessible while closed; it must not require searching inside the details.

Illustrative presentation—not invented user data:

```text
My Vision in Action
My vision: [My saved vision, when available]
[My saved Core focus]

Show my focus details                         ˅
Help me plan

Today’s Priorities
[Chosen calendar items highlighted in the existing schedule]
```

## Vision and everyday priorities: two roles, not two competing lists

- **Vision answers “Where do I want to get to?”** Keep just one quiet reminder; longer vision text opens on request rather than filling the calendar.
- **My Vision in Action answers “What am I working towards?”** Core, Key and Stretch belong here and relate to the person’s vision. Do not use them as the daily-priority fields.
- **Today’s Priorities answers “What needs my attention today?”** The person can highlight existing calendar items using a familiar star control labelled **Mark as a priority** / **Remove priority**. Show the star and readable priority label on the original item; do not create a duplicate checklist. A modest Today’s Priorities heading within the existing schedule makes the distinction clear.
- Day-to-day priorities require no vision connection. For example, collecting a prescription can be today’s priority while the vision focus concerns reconnecting with friends.
- Do not automatically mark the next appointment as a priority or reorder timed appointments away from their real times. Priority is chosen by the person and never changes scheduling.
- For existing vision-focus content, put any confirmation of its connection inside expanded details, not in a new compulsory daily question. Never infer a relationship from wording alone.
- With no saved vision, everyday priorities still work normally. Place an optional **Add my vision** link in the collapsed vision section instead of requiring setup.
- Changing the vision focus or vision clears its previously confirmed connection; it must not silently attach to a new vision.

This makes the relationship visible without displaying the full Vision → Goals → Priorities → Actions hierarchy on every visit. No new progress percentages or claims of improvement are introduced.

## Make the expanded view warmer

Retain the familiar Core / Key / Stretch structure, with gentler descriptions:

- **Core — My main step towards my vision**
- **Key — Another step towards it**
- **Stretch — Only if I feel up to it**

All three remain optional. Stop rotating encouragement automatically in this section. Keep the /start standard: restrained, adult, warm and professional, with no flashing attention cues or extra decorative brain graphics.

## Settings: my choice, remembered

Add one simple **Vision in Action details** choice:

- **Start closed** — recommended default; the focus reminder remains visible.
- **Start open** — show the full focus when entering the calendar.

The person can still open or close it at any time. These are starting preferences, not locks. Keep manual changes while moving between calendar views during the current visit; apply the saved starting choice on a fresh visit. Changing Settings takes effect immediately.

Apply this first to the existing day-view section. Its date-specific saved content remains date-specific; collapsing or renaming it must not carry one day’s plan into another day. Keep other periods supported without adding new focus sections to week/month screens. Leave the separate annual vision editor and Home’s single-priority layout unchanged.

## The brain-health connection

The value is **less information to hold in mind, with a visible reminder of what matters**—not a promise to improve or treat the brain. Do not add a brain score or another assessment to this section. Any existing energy-aware planning remains a suggestion the person can edit, not a rule.

Describe this rationale in product explanations if needed, not as extra instructional text crowding the calendar. Preserve the app’s non-medical disclaimers.

## Technical details

- Update `LaunchCommitmentBanner` with an accessible expandable details section, keeping its existing saved planning data and AI planning flow.
- The reads show two separate vision sources: the My Vision page saves its statement locally, while calendar planning stores `vision_text` in `planning_scopes`. The day-view breadcrumb currently relies on inherited props. Do not present that breadcrumb as a verified goal link.
- Reuse the statement saved by the actual My Vision page for this calendar reminder through a shared reader; explicitly fall back to an existing calendar vision only when no statement exists. Preserve both sources without overwriting or migrating them in this presentation change.
- Remember a user-confirmed vision-focus connection locally, scoped to the signed-in person, planning date and exact focus/vision texts. Recheck those texts before displaying a connection. Preserve existing saved content without automatic reclassification.
- The inspected calendar event interface has no priority field. For this presentation-only change, store highlight choices locally by signed-in person and event ID; only display them for existing, active items. Do not add database migrations or claim cross-device sharing. The calendar remains the sole editable source of the task itself.
- Keep the existing AI planning flow, but inspect its request and review wording before relabelling its output as vision-linked: pass a real selected vision if supported, otherwise require the person to confirm the connection in review. Never silently label a generic daily draft as vision progress.
- Replace the duplicate day-view vision breadcrumb with this single integrated reminder so the calendar does not show two competing vision areas.
- Add the display preference to Launch Settings using the existing device-local preference approach, safely defaulting older saved preferences to closed. Do not promise cross-device synchronisation.
- Use existing design components and semantic Light Linen tokens; maintain 16px body text, large touch targets, keyboard support, announced expanded/collapsed state and reduced-motion support.
- No changes to assessment scoring, recording, membership, Support Circle permissions or scheduling decisions.

## Checks before completion

- Verify closed and open states on narrow phones and desktop, including long focus/vision text and empty plans.
- Verify edits still save, collapsing does not discard edits, and reopening shows saved values.
- Verify Help me plan can be opened and a draft accepted while the details are closed; the visible focus then updates.
- Verify both Settings choices survive a refresh on the same device and switching calendar periods displays the correct saved focus.
- Verify vision focus and everyday priorities stay distinct: highlighting an errand does not change Core/Key/Stretch, and editing vision focus does not mark a calendar item as a priority.
- Verify a missing or edited vision and old saved daily-focus text. No old content is lost or retrospectively labelled as supporting a vision without confirmation.
- Verify priority highlighting, unmarking, refresh, completed/deleted items and different dates; appointment times and order remain unchanged.
- Verify the calendar reads the statement the person saved on My Vision, not an unrelated or stale inherited label.
- Verify navigation, the mic and the calendar remain accessible without overlap.
- For reception testing, ask intended users: “Where is your vision?”, “Which items need your attention today?” and “Does this feel encouraging or demanding?” They should distinguish the two areas without coaching.