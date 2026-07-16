
## Chosen direction: Topographic Pulse (dark hero)

Locked design tokens: Emerald Prestige palette (`#064e3b` deep emerald, `#0d7a5f` mid emerald, `#c9a84c` warm gold, `#f5f0e0` cream), Sora headings + Manrope body, Magazine layout with snapshot as the top hero band.

## What I'll build

### 1. Rewrite `src/pages/launch/LaunchWelcome.tsx`
Replace the current stone-neutral layout with a framed white card on a cream (`#f5f0e0`) canvas, containing four stacked bands:

1. **Chip row** — `Welcome to MyRhythm` (filled emerald), `Founding Edition · v0.1` (mid-emerald outline), `Memory-First Design` (gold-tinted).
2. **Dark hero snapshot band** (deep emerald `#064e3b`) — this is the "map on top". Contains:
   - Left: gold eyebrow "Your starting MYRHYTHM snapshot", the `/100` total set in Sora 7xl on cream, plus the "Tap any letter…" helper in cream/60.
   - Right: the 8 MYRHYTHM letter bars in a dark-tone variant (gold fills with a soft gold glow, cream letter labels), driven by the real `bhs` data.
   - Faint gold topographic contour SVG behind the whole band at 10% opacity.
   - Bottom-of-band caveat: "A snapshot only — not a clinical score…" in cream/30 italic uppercase, above a hairline separator.
3. **Two-column magazine body**:
   - Left 7/12: persona headline in Sora uppercase deep emerald, italic mid-emerald subtitle, gold uppercase micro-tag "We'll meet you wherever you are in your rhythm", then the primary `CONTINUE` button (deep emerald fill, cream text, min-h 56px) and the tiny "Sign in to existing account" link below it.
   - Right 5/12 on cream/30 bg: the three persona highlights as `01 / 02 / 03` in gold Sora with the highlight text in deep emerald and a gold-underline decoration.
4. **Footer strip** — medical disclaimer left, "Built with Memory-First Design" tag right, tiny uppercase.

### 2. Extend `src/components/launch/MyRhythmLetterBar.tsx`
Add `tone?: 'light' | 'dark'` and `height?: string` props. `dark` swaps to a `#f5f0e0/10` track, `#c9a84c` fill with a soft gold glow, and cream Sora letter labels. Existing light usage is unchanged. Dialog/HoverCard content stays as-is (they open on their own surface).

### 3. Motion (framer-motion, already in project)
On mount: card fades up 12px; the `/100` number ticks 0 → total over 900ms; letter bars fill left-to-right with a 60ms stagger. No looping motion.

### 4. Preserved verbatim
- All persona-driven copy from `getMessage()` (headline, italic subtitle, three highlights).
- `LETTER_ORDER` + `bhs` data flow — no scoring changes.
- Chips: `EditionBadge` + `MemoryFirstChip` + welcome eyebrow.
- Medical disclaimer text and `MEMORY_FIRST_DESIGN_TAGLINE`.
- Primary CTA → `/launch/payment`. Secondary "Sign in" → `/launch/signin` (fixed from the current `/auth`).
- `LaunchPageHeader` + `LaunchQuickActions` remain.

### 5. Out of scope for this turn
The returning-user guard (auth + `assessmentCompleted` → redirect to `/launch/home`) — user's current message is scoped to the visual redesign only. Happy to add it next.

## Technical notes

- No new dependencies. Colours applied via inline Tailwind `[#hex]` classes matching the locked palette (component-scoped, kept out of shared tokens because this page is a unique moment).
- Sora + Manrope loaded via a Google Fonts `<link>` injected once from the component (or `index.html`, TBD during build — cheaper to keep the `<link>` inside the component for scope).
- No touch-target regressions: `CONTINUE` remains min-h 56px, letter bars remain full-column tappable buttons.
- Typecheck via `tsgo`; Playwright verify with a seeded `myrhythm_launch_mode` localStorage entry so the snapshot renders.
