## Plan v6.0 — Elite (McKinsey / Google / Deloitte) treatment for /launch surfaces

You're standing on `/launch/capture` — a marketing-style "feature explainer" page that still uses gradient orbs, rounded pill CTAs, generic bullets, and a `from-memory-emerald-500 to-brain-health-500` gradient header. It does not yet match the McKinsey-grade chrome (`SectionHeader`, `KpiCard`, `StatusPill`, `IconBadge`) we built for the Quiet Power dashboard. The same applies to its three siblings (Commit, Calibrate, Clinical Brief) and to several Launch utility pages that were missed in v5.9.

This plan promotes those pages to consulting-deliverable quality while keeping logic, routes, and copy intent intact.

### Visual language (re-confirmed)

- Background: flat `#fafbfc`, no orb gradients.
- Header: `IconBadge` (40 px, ring-1, brand tone) + sentence-case H1 + lede ≤ 24 words.
- Eyebrow label above H1 in 11 px / `tracking-[0.18em]` uppercase, e.g. `CAPABILITY 02 · CAPTURE`.
- Type: one display weight, sentence case. No exclamation marks. Tabular nums for any metric.
- Cards: `rounded-2xl`, hairline `border-brain-health-100`, `shadow-none` to `shadow-sm`. No gradient fills.
- Accent: a single brand-tone vertical bar (`w-0.5 bg-brand-teal-600`) instead of decorative dots.
- Buttons: solid `brand-teal-600` primary, ghost outline secondary. No pill-radius gradient buttons.
- Motion: 200 ms fade + 8 px rise only.

### Pages in scope

```text
src/pages/launch/
  LaunchCapture.tsx          → full elite rebuild (currently on screen)
  LaunchCommit.tsx           → mirror of Capture, same rebuild
  LaunchCalibrate.tsx        → mirror of Capture, same rebuild
  LaunchClinicalBrief.tsx    → elite rebuild (shorter)
  LaunchSettings.tsx         → chrome sweep (SectionHeader, IconBadge, StatusPill)
  LaunchSupportCircle.tsx    → chrome sweep + KpiCard for member counts
  LaunchFeatureStore.tsx     → chrome sweep + KpiCard for usage tier
  LaunchRoadmap.tsx          → chrome sweep + StatusPill for status column
  LaunchWhatsNew.tsx         → chrome sweep + eyebrow per release
  LaunchHelp.tsx             → chrome sweep, replace card emojis with IconBadge
  LaunchAssessment.tsx       → chrome sweep, KpiCard for progress
  LaunchProfile.tsx          → chrome sweep
  LaunchAnalytics.tsx        → KpiCard wiring (already partly done)
  LaunchMemoryBridge.tsx     → header + section bands only (logic untouched)
```

### New shared primitive (one addition)

`src/components/launch/chrome/CapabilityHero.tsx` — reusable header block used by Capture / Commit / Calibrate / Clinical Brief:

- `eyebrow` (e.g. `CAPABILITY 02 · CAPTURE`)
- `title`, `lede`
- `tone` ('teal' | 'emerald' | 'orange' | 'purple') — drives `IconBadge`
- `icon` Lucide
- optional `meta` row (e.g. `Available on Plus`, `Avg. setup 4 min`) rendered with `StatusPill`s

This guarantees the four sibling pages cannot drift apart again.

### Capture / Commit / Calibrate / Clinical Brief — new structure

```text
[ BackButton ]
[ CapabilityHero — eyebrow / H1 / lede / status pills ]

  ┌──────────────── 12-col grid ───────────────────────────┐
  │ Left 8 col                            Right 4 col      │
  │                                                        │
  │ ‘Why it matters’ panel               ‘At a glance’     │
  │  - 2 short paragraphs                 KpiCard ×3       │
  │  - hairline border, single accent     (Setup time,     │
  │    bar on the left                    Privacy, Tier)   │
  │                                                        │
  │ ‘What it does’ — 2-col list           ‘Where it lives’ │
  │  IconBadge + label + 1-line desc       link rows with  │
  │  6 capabilities, no bullet dots        ArrowUpRight    │
  │                                                        │
  │ ‘How it fits the rhythm’ — 3-step                      │
  │  numbered band (01 / 02 / 03)                          │
  └────────────────────────────────────────────────────────┘

[ Engagement footer ]
  Single brand-teal CTA (rect, 12 px radius) + secondary ghost
  Mandatory medical disclaimer in muted 12 px text
```

Copy stays the same intent but is rewritten to executive tone:
- "Never lose precious moments." → "A reliable record of the conversations that matter."
- "Register Now - 7 Day Free Trial" → "Begin 7-day trial".
- "Ready to experience the difference?" → "Ready when you are."

### Utility pages — chrome sweep rules

For each page in scope, replace ad-hoc headers with:

```tsx
<SectionHeader
  eyebrow="SETTINGS"
  title="Configure how MyRhythm supports you"
  lede="Calendars, reminders, and retention — all in one place."
  actions={...}
/>
```

Inline emoji or coloured-circle accents → `IconBadge tone=…`. Status text → `StatusPill`. Numeric summaries → `KpiCard`. Buttons normalised to solid teal / ghost outline.

### Verification

1. `rg -n "from-[a-z-]+-500 to-[a-z-]+-500" src/pages/launch` → 0 hits in scoped pages.
2. `rg -n "🎉|🚀|✨|💪|🧠|❤️|🌟|💡|⭐" src/pages/launch src/components/launch` → still 0.
3. Visual pass on `/launch/capture`, `/launch/commit`, `/launch/calibrate`, `/launch/clinical-brief`, `/launch/settings`, `/launch/support`, `/launch/feature-store`, `/launch/roadmap`, `/launch/whats-new`, `/launch/help` at 1430 px.
4. No route or business-logic changes. `?quiet=0` legacy fallback untouched.

### Out of scope

- Backend, RLS, edge functions, data shape.
- `/launch/home` Quiet Power dashboard (already elite).
- Marketing landing `/`.

### Reversibility

All edits are presentational. New `CapabilityHero` is additive. No deletions; old components remain importable.
