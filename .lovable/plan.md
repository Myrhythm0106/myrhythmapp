# Plan: Unify /launch/* pages with /launch/welcome visual language

## Goal
Make every `/launch/*` page feel like it belongs to the same premium, calm, brain-healthy app family that `/launch/welcome` establishes. Keep `/launch/welcome` exactly as-is (its cream is the locked baseline); apply a lighter complementary cream to all other launch pages.

## What the baseline looks like
`/launch/welcome` uses:
- **INK** hero band (`#064e3b`) with gold eyebrow, title, hairline, and topographic contour lines
- **CREAM** page/cards (`#f5f0e0`) with dark emerald type
- **GOLD** (`#c9a84c`) for accents, borders, and focus
- **Sora** headings + **Manrope** body
- Generous whitespace, sharp edges on the hero card, restrained shadows

## Current gap (verified from screenshots)
Other `/launch` pages (Home, Settings, Calendar, Memory Bridge) currently sit on the same darker cream with plain white cards and no ink hero band. They look utilitarian and do not carry the prestige feel of `/launch/welcome`.

## Selected design direction
**Emerald ivory refinement** — lighter page background (`#faf6ea`), ivory card surfaces (`#fdfcf7`) with gold hairline borders, and an ink emerald hero band on each page. This matches the user's choice from the prototype preview.

## Deliverables

### 1. Theme token update (`src/index.css`)
Add two scoped tokens inside `.launch-theme`:
- `--launch-cream-light: 45 50% 96%` (~`#faf6ea`) — page background for non-welcome launch pages
- `--launch-ivory: 45 60% 98%` (~`#fdfcf7`) — elevated card surfaces
- Utility classes: `.bg-launch-cream-light`, `.bg-launch-ivory`, `.border-launch-gold/30`

Leave `--launch-cream` (`#f5f0e0`) untouched so `/launch/welcome` stays identical.

### 2. Reusable `LaunchHeroBand` component
Create `src/components/launch/LaunchHeroBand.tsx` with:
- Optional gold eyebrow text
- Page title (Sora, white)
- Optional subtitle (cream/white muted)
- Gold horizontal hairline divider
- Optional topographic SVG contour overlay (same as welcome)
- Prop to hide back button when used inside `LaunchLayout`

### 3. `LaunchLayout` background logic
Update `LaunchLayout` so:
- `/launch/welcome` keeps `bg-[hsl(var(--launch-cream))]`
- All other `/launch/*` pages use `bg-[hsl(var(--launch-cream-light))]`
- The sticky header remains white/ivory with gold ring on the logo mark

### 4. `LaunchPageHeader` refinement
Keep the existing back-button row, but restyle it for the lighter cream:
- Use `text-launch-ink` / `hover:bg-launch-ivory`
- Ensure 56px touch target
- Add an optional `hero` prop that renders the page title inside `LaunchHeroBand` instead of inline

### 5. Page-by-page restyling — v0.1 Core 9 routes
Apply the new visual language to each page. For each: add a `LaunchHeroBand`, switch cards to `bg-launch-ivory border border-launch-gold/30`, and update headings to Sora.

1. **`/launch/home`** (QuietHome / LaunchDashboard)
   - Replace the current gradient hero with an ink hero band + gold eyebrow
   - Restyle the daily focus / momentum cards to ivory surfaces with gold hairlines
2. **`/launch/capture`**
   - Ink hero band: "Capture your moment"
   - Recorder / quick-capture card on ivory surface
3. **`/launch/commit`**
   - Ink hero band: "Commit to your rhythm"
   - Action cards on ivory surfaces
4. **`/launch/calibrate`**
   - Ink hero band: "Calibrate"
   - MyRHYTHM-G growth-state picker on ivory card
5. **`/launch/memory`** (Memory Bridge)
   - Ink hero band: "Memory Bridge"
   - Recorder card becomes ivory with gold border; timer/status chips use gold accents
6. **`/launch/calendar`**
   - Ink hero band: "Calendar"
   - Today's focus / day view cards on ivory surfaces
7. **`/launch/support`** (Support Circle)
   - Ink hero band: "Support Circle"
   - Member cards on ivory surfaces
8. **`/launch/settings`**
   - Ink hero band: "Settings"
   - Settings cards become ivory with gold section dividers
9. **`/launch/profile`**
   - Ink hero band: "Profile"
   - Profile cards on ivory surfaces

### 6. Hidden / legacy routes (time permitting)
Apply the same treatment to still-reachable hidden routes (`/launch/settings/edition`, `/launch/discharge-bridge`, etc.) so no launch page visually contradicts the family.

### 7. Verification
- Capture screenshots of all 9 core routes
- Compare side-by-side with `/launch/welcome`
- Run build/typecheck to catch regressions

## Out of scope
- No functional changes to recording, calendar events, scheduling, or support-circle logic
- No new routes or features
- No changes to public landing pages (`/`, `/mvp/*`)

## Success criteria
Every `/launch/*` page (except `/launch/welcome`) loads with the lighter cream background, an ink hero band, and ivory/gold cards that clearly belong to the same visual family as `/launch/welcome`.