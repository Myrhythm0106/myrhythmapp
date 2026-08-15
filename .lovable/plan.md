# Day-Open Welcome — premium rebuild

Make the first screen of the day feel like a considered brand moment (Deloitte report calm, Nike poster confidence) rather than a plain modal — while staying quiet, uncluttered and one-decision simple.

## The locked look

- Palette: Ink + Teal Signal — ground `#0b1418`, panel `#12242b`, line `#1f4a52`, single signal accent `#3fd0c9`. The old green/orange/gold sunrise wash is retired on this screen.
- Type: Archivo Black for the opening line (tight, heavy, all-caps date meta in Hind), Hind for everything else.
- Composition: asymmetric 60/40 — words left, brain artwork right.

## What the screen becomes

```text
┌──────────────────────────────────────────────┐
│  FRI 15 AUGUST · MORNING          ── hairline │
│                                              │
│  A NEW DAY                    ╭────────────╮ │
│  IS MINE,                     │            │ │
│  ANNABEL.                     │   brain    │ │
│                               │  artwork   │ │
│  Nothing from yesterday       │            │ │
│  gets to decide today.        ╰────────────╯ │
│                                              │
│  │ #IChoose statement (teal rule)            │
│                                              │
│  ▸ My vision            (collapsed, tappable)│
│  ▸ Today's shape        (collapsed, tappable)│
│                                              │
│  [ Start my day → ]                          │
│  A daily welcome, not medical advice.        │
└──────────────────────────────────────────────┘
```

- **Date meta line** — small, wide-tracked, uppercase, hairline rule beneath.
- **Opening line** — Archivo Black, oversized, tight leading, left-aligned, breaking across 2–3 lines. This is the empowerment beat.
- **Confidence line** — Hind, generous leading, muted ivory.
- **#IChoose statement** — set off by a thin vertical teal rule instead of a coloured card. Teal is the only accent on the screen.
- **Brain artwork** — moves to the right column, larger, no circular badge or halo. Soft teal glow behind it, subtle slow float. On mobile it sits above the words, smaller.
- **Progressive reveal** — "My vision" and "Today's shape" become collapsed rows with a hairline divider, opening in place when tapped. Nothing extra is shown until asked for. Vision row only appears when a vision is saved.
- **One action** — full-width "Start my day" button, teal on ink, 56px min height, arrow on the right.
- **Motion** — staggered rise: meta → headline → line → statement → rows → button, each ~60ms apart, ease-out. Calm, not bouncy.

## Home screen behind it

Same register carried lightly into the Home screen so the app doesn't drop back to plain after the welcome:
- The greeting strip adopts the uppercase wide-tracked meta treatment for the date/time-of-day line and Archivo Black for the name greeting.
- Section headings on Home cards move to the same heavy-heading / calm-body pairing.
- No layout or content changes on Home — cards, order and behaviour stay exactly as they are. This is a type-and-spacing pass only.

## Technical notes

- Fonts: add Archivo Black + Hind via Google Fonts link in `index.html`; register `font-display` (Archivo Black) and `font-body` (Hind) in `tailwind.config.ts` `fontFamily`.
- Tokens: rewrite the `.day-open-*` block in `src/index.css` (lines ~639–657) to the Ink + Teal ramp — `--day-open-ink`, `--day-open-panel`, `--day-open-line`, `--day-open-signal`, plus ivory opacity steps. Replace `.day-open-wash` with a single low, wide teal radial plus a fine top-edge sheen. Retire `.day-open-halo` and `.day-open-gold`; repoint `.day-open-cta` to the teal signal on ink with dark foreground for AA contrast.
- `src/launch/daily/DayOpenWelcome.tsx`: restructure to a two-column grid (`lg:grid-cols-[3fr_2fr]`, stacked below `lg`), add the collapsed reveal rows (local `useState`, `AnimatePresence` height animation, `aria-expanded` on the row buttons), keep the existing localStorage once-per-day logic, dismiss handler, dialog roles and disclaimer line untouched.
- Accessibility: 56px tap targets on the button and reveal rows, 16px body floor, focus rings retained, brain image stays decorative (`alt=""`).
- `src/components/launch/quiet/QuietHome.tsx`: greeting strip typography only.
