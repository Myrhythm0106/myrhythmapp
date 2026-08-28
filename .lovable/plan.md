# Next Step Summary — make it look as smart as it is

The table does the right things (inline editing, RACI, reminders, dates, traceability) but visually it reads as a raw spreadsheet: flat grey header, mixed ad-hoc colours (red/blue/purple badges from a different palette), cramped text, and no sense of hierarchy. This is a presentation-only pass — every column, edit behaviour and save handler stays exactly as it is.

## Design direction: "Executive brief"

The summary should feel like a polished one-page brief your PA hands you — calm, structured, quietly premium. Emerald Prestige palette (brain-health greens, brand-orange accents, ivory surfaces) applied consistently, replacing the current mix of red/blue/purple utility colours.

## What changes

### 1. Table frame & header
- Header row becomes a solid brain-health-900 (deep green) bar with ivory uppercase tracking-wide labels — instant "professional document" feel.
- Sticky header when scrolling long lists.
- Row height relaxed (more vertical padding), subtle row separators instead of the hard grid, and a soft ivory hover instead of grey.

### 2. One coherent colour language
- Priority: replace the pulsing red/orange/green dots + "High/Med/Low" text with quiet pill badges — High = brand-orange, Medium = brain-health-500, Low = muted. No animation (the pulse reads as an alarm, not a plan).
- Status: map existing labels onto the same palette — "Ready to Begin" neutral, "In My Flow" brain-health teal, "Accomplished!" emerald with a small tick icon, "Paused" amber, "Redirected" muted. Remove the red/blue badge set.
- "Due in" chips keep their meaning (amber today/tomorrow, red overdue) but styled as the same pill family so nothing looks bolted on.

### 3. Typography & hierarchy
- Action text becomes the clear hero of each row: 15px, medium weight, ink colour, generous line height.
- "I'll know I'm done when…" sits beneath it in a smaller, softer style with a small tick glyph — clearly a sub-note, not competing text.
- Secondary columns (dates, who's involved, reminders) drop to 13px muted so the eye lands on the action first.
- Source reference line stays but rendered as a quiet footnote chip.

### 4. Column polish
- "Who's involved" chips get consistent pill styling with initials avatars aligned to the emerald palette (replacing the purple avatar set).
- Date cells show an icon + formatted date on one line, "—" states styled as quiet placeholders with a hint ("Set date") instead of a bare dash, so empty cells look intentional and inviting rather than blank.
- The drag grip and "…" menu become visible only on row hover (always visible on touch devices) to declutter the resting view.

### 5. Header strip above the table
- A slim summary bar: "N next steps · X done this week" plus the existing "Send to everyone" action, styled as the single brand-orange primary button — one obvious action per the 3-choice guardrail.

## Guardrails (unchanged behaviour)
- No columns removed, no interactions changed — every tap-to-edit, sheet, popover and save handler works identically.
- Min 56px touch targets and WCAG AA contrast on every new colour pairing.
- All colours via semantic tokens / existing palette — no new hardcoded hex values.
- Cards (mobile) view gets the same pill/typography treatment so both views feel like one product.

## Technical notes
- `src/components/memoryBridge/ActionsTableView.tsx`: restyle TableHeader/TableRow/TableCell classes, rewrite `PriorityIndicator` and status option colour map, adjust `EditableText`/`EditableDate`/`EditableDueIn` display (non-edit) states, restyle watcher avatars and the empty-date placeholders. No prop or handler signature changes.
- `src/components/memoryBridge/WhosInvolvedCell.tsx`: palette pass on chips/avatars only.
- `src/components/memoryBridge/ActionsCardsView.tsx` (mobile cards): matching pill + typography tokens.
- `src/components/memoryBridge/ActionsViewer.tsx`: add the slim summary bar above the table; reuse existing action counts, no new queries.
- No backend, schema, or data-flow changes.
