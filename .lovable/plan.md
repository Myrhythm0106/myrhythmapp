# Plan v5.9 — McKinsey-Grade Polish for Launch Pages

Goal: every `/launch/*` surface should feel as poised as a top-tier consulting deliverable — calm, confident, icon-led, never childish. No emojis, no exclamation-heavy copy, no toy gradients.

## Principles (applied uniformly)

1. **No user-facing emojis.** Replace with Lucide icons (stroke 1.75) or geometric shapes/initials.
2. **Restrained typography.** One display weight per surface, sentence case headings, no ALL-CAPS shouting except small eyebrow labels.
3. **Disciplined color.** Brand tokens only; muted surfaces, single accent per card. No rainbow gradients.
4. **Editorial spacing.** Generous whitespace, 8pt rhythm, max content width ~1100px on desktop.
5. **Quiet motion.** Subtle fades/slide-up only; no bounces, no confetti spray.
6. **Sober copy.** Replace "You're amazing!" / "Let's crush it!" with calm, capable language ("Well executed.", "Ready when you are.").

## Scope — 21 files identified, grouped by surface

### A. Dashboard & Hero surfaces
- `LaunchDashboardLegacy.tsx`, `HeroSection.tsx` (referenced by legacy)
  - Replace "YOUR COMMAND CENTER" shout-headline with sentence-case "Your day, organised."
  - Strip emojis, downgrade gradient to single-tone wash.
- `QuietHome.tsx` (already calm) — minor copy polish, ensure tier pill uses neutral grey.

### B. Calendar suite
- `LaunchCalendar.tsx`, `calendar/Launch{Day,Week,Month,Year}View.tsx`, `LaunchCommitmentBanner.tsx`
  - Remove emoji event markers; use coloured 6px dots and Lucide category icons.
  - Banner: drop celebratory emojis, use `BadgeCheck` icon + concise status.

### C. Goals / Vision / Gratitude
- `LaunchGoals.tsx`, `LaunchGratitude.tsx`, `vision/{DreamCard,DreamCreator,JourneyView,ShareVisionBoard}.tsx`
  - Replace heart/star emojis with `Target`, `Compass`, `Bookmark`, `Quote` icons.
  - Vision board export: keep brand gradient but remove emoji decorations.

### D. Brain Games & Analytics
- `LaunchBrainGames.tsx`, `LaunchAnalytics.tsx`
  - Game tiles: Lucide icons + monochrome covers, no emoji thumbnails.
  - Analytics: tabular KPI cards (label · value · delta arrow), sparkline accents only.

### E. Celebrations & motivational
- `CompletionCelebration.tsx`, `MomentumCelebration.tsx`, `PowerMovesSection.tsx`, `WinningWeekTracker.tsx`, `LaunchAppTour.tsx`, `GrowthFooter.tsx`
  - Replace party/rocket emojis with `CheckCircle2`, `TrendingUp`, `Award` SVG glyphs.
  - Reduce animation amplitude; single fade + 8px rise.
  - Rewrite copy to executive-summary tone.

### F. Shared chrome
- `LaunchLayout.tsx`, `LaunchNav.tsx`, `LaunchCard.tsx`
  - Header logo: keep monogram; switch to single brand-teal flat (no tri-gradient).
  - Card variants: tighten radii (3xl → 2xl), softer shadows, hairline borders `border-brain-health-100`.
  - Nav active state: underline + neutral fill instead of green pill.

### G. Auth / onboarding entry pages
- `LaunchLanding.tsx`, `LaunchWelcome.tsx`, `LaunchRegister.tsx`, `LaunchSignIn.tsx`, `LaunchUserType.tsx`, `LaunchAssessment.tsx`, `LaunchPayment.tsx`
  - Reframe headlines as outcome statements ("A clearer rhythm, day by day.").
  - Replace emoji bullet lists with icon + label rows.
  - Buttons: solid brand-teal primary, outline secondary; remove gradient buttons.

### H. Settings / Profile / Help / Roadmap / WhatsNew / FeatureStore / SupportCircle / MemoryBridge / Capture / Commit / Calibrate / ClinicalBrief
  - Audit pass: emoji strip, copy de-shouting, consistent section header pattern (`<Eyebrow>` + `<H2>` + `<Lede>`), Lucide-only iconography.

## New shared primitives (added once, reused)

- `src/components/launch/chrome/SectionHeader.tsx` — eyebrow + title + optional lede.
- `src/components/launch/chrome/KpiCard.tsx` — label, value, delta, optional sparkline slot.
- `src/components/launch/chrome/StatusPill.tsx` — neutral, success, attention variants.
- `src/components/launch/chrome/IconBadge.tsx` — 40px rounded square hosting a Lucide icon in a brand tone.

These replace ad-hoc inline cards across the surfaces above to guarantee consistency.

## Copy guidelines (applied during sweep)

- Headings: sentence case, no exclamation marks.
- CTAs: verbs + object ("Begin assessment", "Open clinical brief"). Avoid "Let's…", "Crush…", "You got this".
- Empty states: 1 sentence + 1 action. No mascot phrasing.
- Disclaimers: keep mandatory medical disclaimer wording verbatim.

## Verification

1. `rg "🎉|✨|💪|🧠|❤️|🌟|🚀|👋|😊|🙌|🎯|💡|⭐|🔥|👍|🌈|☀️|🌙|🎊|🏆|💎|🤝|👏|💚|💙|💜" src/pages/launch src/components/launch` returns 0 hits.
2. Manual screenshot pass (Dashboard, Calendar, Goals, Analytics, Support Circle, Settings) at 1430px and 390px to confirm consistent chrome.
3. No regression in routes — `?quiet=0` legacy fallback still works.

## Out of scope

- Backend/data changes, RLS, edge functions.
- Marketing landing (`/`) — already covered by separate brand pass.
- Auth flow logic — visual only.

## Reversibility

All edits are presentational. Shared primitives are additive; existing components remain importable. No file deletions.
