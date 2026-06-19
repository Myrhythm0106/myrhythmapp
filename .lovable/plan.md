
# Plan v53 — Launch page: Life Empowerment + Productivity framing, 50% Founding strip, Calendar-led Day-in-the-life

## Item 1 — Life Empowerment & Productivity differentiator
File: `src/components/mvp/MVPCore4C.tsx` (label/sub-line edit only)

- **Top label (replaces current differentiator label):**
  "Built for Life Empowerment — brain injury, memory and cognitive challenges. And Productivity — useful for anyone carrying a lot."
- **H2 (kept):** "The gap between clinically ready and life-ready is where people fall."
- **Sub-line (revised):**
  "MyRhythm is shaped for the weeks after the folder closes, and for anyone whose responsibilities outrun their energy."
- **Hero H1:** unchanged.
- "Discharge cliff" stays internal-only. No medical claims.

## Item 2 — Founding 50% trust strip
New: `src/components/launch/FoundingTrustStrip.tsx`, mounted in `MVPCore4C` above the 4C cards.

- Glass-morphism pill, dot-separated micro-claims, no CTA.
- Copy: "Founding Edition · v0.1 — 50% off for life for founding members · Funds founder-led development · No card required to start · Your data stays yours."
- Uses `EditionBadge` + brand tokens (no hardcoded colors).
- Free access for you + your husband stays an admin/data task; not surfaced in public copy.

## Item 3 — "A day you actually run" calendar-led day-in-the-life strip (REVISED)

New: `src/components/launch/DayInTheLifeStrip.tsx`, mounted in `MVPCore4C` below the 4C cards.

The calendar is now the **center of the strip**, not one card among five. The story is: *you stay in control of your day because MyRhythm shows you your most-productive windows, your Brain Health score, and lets you flex when energy or availability shifts.*

**Heading:** "A day you actually run."
**Sub:** "Your calendar, your call — informed by your peak windows, your Brain Health score, and what's already on your plate."

**Layout (desktop `md:grid-cols-[1fr_2fr_1fr]`, stacks on mobile):**

```
┌──────────────────┐  ┌──────────────────────────────┐  ┌──────────────────┐
│  Left rail       │  │  Center: Today's calendar    │  │  Right rail      │
│  (signals that   │  │  (mini day view, 08–20)      │  │  (flex actions)  │
│   shape the day) │  │                              │  │                  │
└──────────────────┘  └──────────────────────────────┘  └──────────────────┘
```

**Left rail — "What MyRhythm knows this morning":**
- Energy Check chip: "Today: steady · 3/5"
- Peak window chip: "Your peak: 09:30–11:30"
- Brain Health score chip: "Brain Health 72 · from your initial assessment"
- Tiny caption under rail: "Signals, not instructions."

**Center — mini calendar day view (static, illustrative):**
- Vertical timeline 08:00 → 20:00 with 4 blocks rendered as glass cards:
  - 08:30 Energy Check (low-load chip)
  - 10:00 Deep focus — Memory Bridge review (peak-window chip, brand-orange-500)
  - 13:00 Lunch + walk (recovery chip)
  - 16:00 Family call — Support Circle (medium-load chip)
- Peak-window band shaded behind 09:30–11:30.
- Small footer line: "Synced with Google / Outlook in Settings."

**Right rail — "You're in control":**
- "Reschedule with one tap" — example: "Moved 16:00 → 17:30 because energy dipped."
- "Flex by availability" — "Skips blocks your calendar already owns."
- "Flex by Brain Health" — "Lighter load on lower-score days."
- Closing line: "MyRhythm proposes. You commit."

**Visual rules:**
- Glass cards, brand tokens only (no hardcoded colors).
- Peak-window band uses `brand-orange-500/10` with `brand-orange-500` left border.
- Brain Health chip uses existing brain-health tokens.
- Static illustrative data — no live calendar fetch, no real Brain Health pull.
- No medical claims; Brain Health score is described as "from your initial assessment", not as a diagnosis.

## Files touched
- `src/components/mvp/MVPCore4C.tsx` — label + sub-line edit; mount both new strips.
- `src/components/launch/FoundingTrustStrip.tsx` — new.
- `src/components/launch/DayInTheLifeStrip.tsx` — new (calendar-led 3-column layout).

## Out of scope
- Real Google/Outlook fetch in this strip (already lives in Settings).
- Live Brain Health score lookup on the landing page.
- Stripe/Paddle 50% coupon wiring.
- Comping your + husband's accounts (separate admin task).
- Testimonials, new imagery, Science page edits, `/launch` routing changes.

Approve to build all three items as written, or tell me what to adjust.
