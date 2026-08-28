# Next Step Summary — consultancy-grade rebuild

The last pass only recoloured badges. This one rebuilds the surface so it reads like a page out of a Deloitte or Accenture deliverable: a titled, framed exhibit with a control bar, disciplined column rhythm, and typography that carries authority. Every column, tap-to-edit behaviour and save handler stays exactly as it is — this is presentation only.

## Locked design decisions

- Palette: Emerald Prestige — `#0B3B32` deep emerald ink, `#12695A` mid emerald, `#7FB8A6` soft emerald, `#F7F4EC` ivory surface, `#F97316` brand orange for the single primary action.
- Type: Sora for headings, labels and numerals; Manrope for body and cell text. Both already load in the app.
- Layout: dense data grid — one framed exhibit, sticky header, everything visible at a glance.

## What it will look like

### 1. Exhibit frame
The table sits inside a single bordered "document" panel on ivory, with a hairline emerald rule and a squared-off 12px radius — no floaty shadows, no rounded card softness. Nothing else competes with it on the page.

### 2. Exhibit header bar
Above the grid, a title band inside the same frame:
- Left: small uppercase Sora eyebrow `NEXT STEP SUMMARY`, and beneath it the live count line — "12 next steps · 4 accomplished this week · 2 due today".
- Right: one primary orange "Send to everyone" button. Secondary controls (sort, show archived) sit as quiet text buttons, not competing buttons.
- A thin emerald progress rule under the band showing completion share — a single measured data cue, no decoration.

### 3. Column discipline
The real problem is rhythm, not colour. Fixed column proportions so the grid never looks scrunched or empty:
- Action + "I'll know I'm done when…" takes ~40% and is the only place text wraps.
- Priority, Status, Start, Finish, Due in, Who's involved, Reminders get fixed narrow widths with tabular numerals and consistent alignment (dates right-aligned, states centred).
- Vertical hairline separators between column groups (identity | timing | people) — the classic consultancy exhibit device that makes a wide table legible.
- Sticky header in deep emerald `#0B3B32`, ivory Sora labels at 11px, letter-spacing 0.14em.
- Row height 56px minimum, zebra-free; separation via hairlines and an ivory hover tint.

### 4. Typography hierarchy
- Action text: Manrope 15px/1.45, `#0B3B32`, medium.
- Success criteria: 12.5px, `#12695A`, prefixed by a small tick glyph, clearly subordinate.
- All dates, counts and "due in" values: Sora, tabular-nums, 13px — numbers line up down the column.
- Reference codes render as a monospaced footnote chip, 10.5px, muted.

### 5. State language, one family
Every state chip uses the same geometry: 22px tall, 6px radius (not fully round — pills read consumer, squared-off reads professional), 11px Sora semibold.
- Priority: High = orange fill, Medium = mid-emerald outline, Low = grey outline.
- Status: Ready to Begin = grey outline, In My Flow = emerald fill tint, Accomplished = solid emerald with tick, Paused = amber outline, Redirected = muted.
- Due in: same chip family; overdue = solid red-brown, today/tomorrow = amber, otherwise plain text.

### 6. Restraint
- Drag grip and "…" menu appear on hover only (always visible on touch).
- Empty dates show a quiet "Set date" affordance, not a dash.
- Who's involved chips move to squared emerald chips with initials, matching the state family.
- Mobile cards view gets the same type scale, chip family and hierarchy so both views read as one product.

## Technical notes

- `src/components/memoryBridge/ActionsTableView.tsx`: exhibit frame + sticky emerald header, `<colgroup>` fixed widths, group separators, chip component unified into one `StateChip` helper, typography classes, tabular numerals. No prop or handler changes.
- `src/components/memoryBridge/ActionsViewer.tsx`: exhibit header band with counts, completion rule, primary/secondary control grouping — reuses existing action arrays, no new queries.
- `src/components/memoryBridge/WhosInvolvedCell.tsx` and `ActionsCardsView.tsx`: chip and type pass to match.
- `tailwind.config.ts` / `index.css`: add Sora/Manrope font utilities and the Emerald Prestige exhibit tokens (surface, rule, ink) as semantic variables — no hardcoded hex in components.
- Guardrails kept: 56px touch targets, WCAG AA contrast on every chip pairing, one primary CTA per screen. No backend, schema or data-flow changes.
