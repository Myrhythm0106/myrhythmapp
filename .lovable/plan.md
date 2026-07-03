## Plan: Landing Page Messaging Simplification (v9)

### Goal
Reduce cognitive overload on the `/launch` landing page by shortening copy, clarifying the founder CTA, hiding the clinical-vs-life-ready strip behind a toggle, recolouring distracting orange body text, and making scarcity feel real.

---

### Changes

#### 1. Hero sub-line (MVPCore4C.tsx, line 113)
- **From:** `Transform cognitive challenges into unstoppable strength with science-backed tools designed for your journey.`
- **To:** `Transform cognitive challenges into unstoppable strength.`

#### 2. Founder email CTA — clearer identity (MVPCore4C.tsx, lines 127-149)
- **Button text:** `Reserve my spot` → `Become a Founding Member`
- **Add micro-heading above email input:** `Founding Member — limited to first 1,000`
- **Add helper line below button:** `Founding spots are limited — join the first 1,000`
- Keep email capture logic unchanged.

#### 3. Collapsible "How MyRhythm answers it" strip (MVPCore4C.tsx, lines 192-260)
- Wrap the differentiator block, numbered 01-04 cards, "The evidence behind this" link, and trust strip inside the existing `@/components/ui/collapsible`.
- **Default state:** Closed.
- **Trigger button:** `See how MyRhythm answers this ↓`
- **Close button:** `Show less ↑`
- Pain-point image cards (lines 166-190) and 4C loop cards (lines 262-415) remain fully visible.

#### 4. Recolour orange body text (keep words)
- Line 197 eyebrow (`text-brand-orange-500`) → `text-brain-health-600`
- Line 238 card taglines (`text-brand-orange-500`) → `text-memory-emerald-700`
- Orange stays on primary buttons and icon accents only.

#### 5. Scarcity messaging on banner + pricing card
- **FoundingMemberBanner.tsx:** Replace `873 spots remaining` with `Founding spots are limited — join the first 1,000`
- **FoundingMemberPricingCard.tsx:** Replace `First 1,000 members get founding rates. 873 spots remaining.` with `Founding spots are limited — join the first 1,000`

---

### Files touched
1. `src/components/mvp/MVPCore4C.tsx`
2. `src/components/landing/FoundingMemberBanner.tsx`
3. `src/components/landing/FoundingMemberPricingCard.tsx`

No new dependencies. Uses existing `@radix-ui/react-collapsible` wrapper.

### Out of scope
- Hero visual redesign
- Changes to `/launch/register` or `/launch/science` copy
- Consolidating the 3 end-of-page CTAs into one
- Fixing non-text `sunrise-amber` gradient tokens