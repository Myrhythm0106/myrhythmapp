# Memory Bridge — "Serene focus hub" redesign

Approved direction: **Serene focus hub** (v3), with the user's added direction: the centre action gets a **soft glowing teal breathing animation**. Brand palette stays deep emerald / gold / ivory, with teal introduced as the secondary accent.

## What this changes

### 1. Memory Bridge entry screen (`/launch/memory`, idle state) — the main work
Rebuild the pre-recording view of `src/pages/launch/LaunchMemoryBridge.tsx` as a single centred "focus hub" card instead of the current dense multi-section layout:

```text
┌─────────────────────────────┐
│      gold-ring brand mark    │
│        Memory Bridge         │
│  "Preserve your thoughts in  │
│   perfect rhythm…"           │
│                              │
│  ┌────────────────────────┐  │
│  │   START CAPTURE  →     │  │  ← teal breathing glow, 72px
│  └────────────────────────┘  │
│  [ Review Logs ] [ Quick Note ]│  ← two gold-outlined 64px tiles
│  ──────────────────────────  │
│     Why it matters  ⌄        │  ← teal progressive disclosure
└─────────────────────────────┘
```

- One dominant **Start Capture** button (emerald, 72px, ≥56px touch rule) wrapped in a soft teal breathing glow (slow scale/opacity keyframes, `prefers-reduced-motion` respected).
- Ivory glass card (`bg-white/60 backdrop-blur`), 40px radius, thin gold border, ambient teal + gold blurred glows behind.
- Exactly **3 visible choices** (Start Capture, Review Logs, Quick Note) — everything else moves behind the "Why it matters" disclosure and the existing Past Captures list.
- The recording-allowance egg timer stays visible as a quiet caption under the primary button (per the allowance-ladder memory).
- Serif display headline (Playfair-style, matching the Emerald Prestige direction already in use) + light body copy, first-person tone.

### 2. Recording / processing / review states unchanged
Once recording starts, the existing recorder, staged processing and Capture Brief review keep working exactly as they do — this is a display redesign of the entry surface, not the flow. The persistent capture banner, FAB and You-Are-Here dial are untouched.

### 3. Capture capability page (`/launch/capture`) — light alignment
Slim `LaunchCapture.tsx` so it matches the same language: keep the emerald hero but cut the stat-card stack to one compact row, and make its primary CTA "Open Memory Bridge" → `/launch/memory` (instead of the trial CTA) so the two pages feel like one surface.

### 4. Tokens
Add the teal accent and breathing-glow keyframes to the design tokens (`index.css` / tailwind config) — no hardcoded hex in components beyond what the token layer exposes.

## Guardrails honoured
- Max 3 choices, ≥56px targets, glass morphism, no medical claims, disclaimer retained.
- No new features, tables, or routes. Nothing deleted.

## Technical notes
- Files touched: `src/pages/launch/LaunchMemoryBridge.tsx` (idle-state render), new small component `src/components/memoryBridge/CaptureHub.tsx` (so the 1382-line page doesn't grow), `src/pages/launch/LaunchCapture.tsx`, `src/index.css` + `tailwind.config` tokens.
- Breathing animation implemented as a CSS keyframe utility (`animate-breathe`), disabled under `prefers-reduced-motion`.
- Verify with a Playwright screenshot of `/launch/memory` idle state afterwards.
