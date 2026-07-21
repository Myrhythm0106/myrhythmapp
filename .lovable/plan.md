
# Unify /launch/* under the Welcome page palette + burnt-orange accent

## The look we're matching

`/launch/welcome` uses a page-scoped **Emerald Prestige** palette with Sora + Manrope typography:

- INK `#064e3b` — deep emerald (headings, dark hero bands)
- MOSS `#0d7a5f` — mid emerald (hover, secondary accents)
- GOLD `#c9a84c` — warm gold (primary CTAs, letter bars)
- CREAM `#f5f0e0` — page background, soft panels
- **NEW — EMBER `#c65a2e`** — burnt orange, used sparingly as a professional accent
- White cards with `border-[#064e3b]/10` hairlines

Every other /launch page still uses the old tokens (`bg-[#fafbfc]`, `brand-teal-600`, `brain-health-*`), which is why they feel cheaper next to Welcome.

## Where the burnt orange goes (sparing, intentional)

Burnt orange is a **third-tier accent** — never a primary surface, never a CTA background (GOLD keeps that job). Rules of use:

- Small, high-signal moments only — not decorative fills.
- Never larger than ~10% of any screen's colored area.
- Never adjacent to GOLD in the same interactive element (they'd fight); separate by white or cream.
- Text/icon use on white or cream only (contrast passes AA); never orange text on gold.

Concrete placements:

- **Live/active state indicators**: recording pulse dot on Memory Bridge/Capture, "syncing" spinner on the calendar sync bar, "in progress" chip on smart schedule cards.
- **Countdown urgency tier**: the recorder countdown already goes color-coded at 5m / 1m / 10s — swap the mid-tier (5m warning) to EMBER, keeping red for the 10s critical state.
- **Focus / hover rings** on secondary buttons and inputs (`ring-2 ring-[#c65a2e]/40` on focus-visible) — an emerald page with an ember focus ring reads confident, not corporate.
- **Section accent bars**: 3-4px left border on select cards (Daily Brief "Today's focus", MyRHYTHM-G chip picker header, Support Circle "loop someone in" prompt).
- **Underline swipes** on active nav item / You-Are-Here dial's current-route tick.
- **Number/stat highlights**: streak counters, "n actions extracted" badges, remaining-minutes pill border when > 5m left.
- **Link hover** in body copy: default INK → hover EMBER (never GOLD, which reads like a button).

That's it — no ember buttons, no ember card backgrounds, no ember hero bands.

## Approach — theme once, touch a few

Rather than rewrite 30+ pages one by one, promote the palette to a **launch theme layer** and let it cascade. Then hand-polish the highest-visibility screens so they look intentional.

### 1. Add tokens to the launch scope

In `src/index.css`, add a `.launch-theme` scope:

```css
.launch-theme {
  --launch-ink:   158 84% 17%;   /* #064e3b */
  --launch-moss:  158 80% 26%;   /* #0d7a5f */
  --launch-gold:   43 55% 54%;   /* #c9a84c */
  --launch-cream:  44 60% 92%;   /* #f5f0e0 */
  --launch-ember:  17 63% 48%;   /* #c65a2e — burnt orange accent */

  --background: var(--launch-cream);
  --foreground: var(--launch-ink);
  --primary:    var(--launch-ink);
  --primary-foreground: var(--launch-cream);
  --accent:     var(--launch-gold);
  --ring:       var(--launch-ember);
  --border: 158 84% 17% / 0.10;
  --card: 0 0% 100%;
  --card-foreground: var(--launch-ink);

  font-family: 'Manrope', system-ui, sans-serif;
}
.launch-theme h1, .launch-theme h2, .launch-theme h3,
.launch-theme .font-display { font-family: 'Sora', system-ui, sans-serif; }
```

Import Sora + Manrope once via `<link>` in `index.html` (currently pulled per-page inside Welcome).

### 2. Apply the theme at `LaunchLayout`

In `src/components/launch/LaunchLayout.tsx`:

- Add `launch-theme` class to the outermost wrapper.
- Swap `bg-[#fafbfc]` → `bg-[hsl(var(--launch-cream))]`.
- Header: cream-tinted white, border `border-[hsl(var(--launch-ink))]/10`, logo tile `bg-[hsl(var(--launch-ink))]` with GOLD "M", wordmark in INK. Active nav item gets an EMBER underline swipe.
- `LaunchYouAreHereDial` trigger: INK ring; current-route tick in EMBER.

### 3. Retire mismatched brand utilities inside /launch

Scoped sweep of `src/pages/launch/**`, `src/components/launch/**`, `src/launch/**`:

- `bg-brand-teal-600` / `text-brand-teal-*` → INK
- `bg-brain-health-*` surfaces → white cards with INK/10 hairlines
- `text-brain-health-900` → INK
- Primary CTAs → GOLD fill, INK text, hover INK/CREAM (Welcome-style)
- Progress bars, letter chips → GOLD on cream, INK strokes
- Focus rings → EMBER

Non-launch pages (`/`, marketing, admin) untouched.

### 4. Hand-polish the highest-visibility screens

Theme swap is enough for utility pages, but these get a Welcome-quality pass with the ember placements above:

- **LaunchHome** — Daily Brief card gets a 3px EMBER left-border on "Today's focus".
- **LaunchCapture / LaunchMemoryBridge** — recorder pulse dot = EMBER; countdown pill border in EMBER when > 5m; mid-tier warning EMBER.
- **LaunchCommit** — smart schedule "in progress" chip = EMBER on white.
- **LaunchCalibrate** — MyRHYTHM-G chip picker: today's selected state gets an EMBER underline.
- **LaunchCelebrate** — streak counter number in EMBER.
- **LaunchCalendar** — sync bar "syncing" spinner in EMBER; Add Event modal focus rings EMBER.
- **LaunchSupportCircle** — "Loop someone in" prompt card gets EMBER left-border; LoopInPicker focus ring EMBER.
- **LaunchAssessment / LaunchPayment** — align buttons + cards to Welcome; "Back to your results" link hover in EMBER.

### 5. Refactor Welcome to consume the tokens

Replace hardcoded `INK/MOSS/GOLD/CREAM` constants in `LaunchWelcome.tsx` with the CSS variables and add EMBER to the "lowest letter" nudge dot so Welcome and the rest of /launch stay in sync.

## Guardrails

- Contrast: INK on CREAM ~10.5:1, GOLD on INK ~5.8:1, EMBER on CREAM ~4.8:1 — all pass AA. EMBER on white ~4.6:1 (AA normal text OK). Never EMBER on GOLD.
- 56px touch targets + glass morphism rules stay intact.
- No component API changes — pure visual layer.
- Non-launch routes untouched.

## Out of scope

- Marketing/root landing (`/`) keeps current styling.
- No copy changes, no new features.

## Rollout order (single build session)

1. Fonts + `.launch-theme` tokens (incl. EMBER) in `index.css` + `index.html`.
2. `LaunchLayout` wrapper + header.
3. Scoped find/replace of teal & brain-health utilities inside launch files.
4. Refactor `LaunchWelcome` onto shared tokens.
5. Hand-polish pass with EMBER placements on the 8 high-visibility screens.
6. Visual QA on `/launch/home`, `/launch/capture`, `/launch/calendar`, `/launch/support`, `/launch/payment`.
