

## Assessment: Current Deck vs. Requested Structure

The current deck has the right skeleton but significantly different messaging. The user's version is **sharper, more precise, and uses investor-grade language** focused on "reliability," "behaviour," and "continuity" rather than the more generic wellness framing currently in place.

### Slide-by-Slide Comparison

| # | User Wants | Current Has | Status |
|---|-----------|-------------|--------|
| 1 | "Stabilising behaviour when thinking and memory become unreliable" | "Continuous Cognitive Support" (generic) | **Rewrite** |
| 2 | "Recovery Does Not Restore Reliability" | Stats-heavy TBI numbers | **Rewrite** |
| 3 | "Healthcare Measures Safety. Life Requires Stability." | "Patient goes home, system moves on" | **Rewrite** |
| 4 | "Failure Happens Between Remembering and Acting" (re-engagement failures) | Post-discharge cascade (promises, trust, burnout) | **Rewrite** |
| 5 | "The Scale — An Invisible but Massive Population" | Does not exist | **New slide** |
| 6 | "Tools Depend on the Ability They Require" | Similar table but different framing | **Rewrite** |
| 7 | "Behaviour Collapses When Cognition Fluctuates" | "Recovery is a daily practice" | **Rewrite** |
| 8 | "Continuous Cognitive Support — missing layer between capability and dependable functioning" | Similar but softer language | **Rewrite** |
| 9 | "Capture → Commit → Calibrate → Celebrate" | Four pillars (Memory Bridge, Escalation, etc.) | **Rewrite** |
| 10 | "A Closed Behaviour Loop Across the Day" | Vision/Purpose/Goals slide (different content) | **Replace** |
| 11 | Expansion Diagram with caption about wedge/scalability/inevitability | Concentric circles exist but caption missing | **Rewrite** |
| 12 | Market Size + "We begin with concentrated need..." | TAM/SAM/SOM exists, needs line added | **Update** |
| 13 | "Built-in Adoption Channels: Rehab → Home → Family → Workplace → Insurer" | Similar but different framing | **Rewrite** |
| 14 | "What Happens When People Use It" (consistency, restart, confidence) | Current evidence slide is feature-focused | **Rewrite** |
| 15 | "Recurring Behavioural Infrastructure" (subscription, clinical, workforce) | Current B2C/B2B pricing model | **Rewrite** |
| 16 | "Behavioural continuity infrastructure" (not productivity, not therapy) | Competitor comparison table | **Rewrite** |
| 17 | "Funding the First Continuity Network" | Current ask with fund allocation | **Rewrite** |
| 18 | "Built From the Gap It Solves" | Current founder slide | **Rewrite** |

### Key Messaging Shifts

The user's version makes three critical upgrades:

1. **From "wellness" to "reliability"** — Investors understand reliability as infrastructure. "Cognitive wellness" sounds like a nice-to-have. "Behavioural reliability" sounds like a must-have.

2. **From features to behaviour loops** — "Capture → Commit → Calibrate → Celebrate" is a system, not a feature list. Slide 10 ("closed behaviour loop") shows the mechanism, not the toolbox.

3. **The expansion caption** — "We start where the need is undeniable and expand to where reliability is universally required." This single line explains wedge, expansion, scalability, and inevitability. Currently missing.

### Removed Slides
- **Vision, Purpose & Goals** (current Slide 9) — absorbed into the solution and behaviour loop
- **Universal Utility** (current Slide 11) — absorbed into the expansion diagram caption and market size slide

### Implementation

Full rewrite of `InvestorSlides.tsx` with all 18 slides using the user's exact headlines, framing, and structure. Same file, same shell, same 18-slide count. The `InvestorDeckPage.tsx` and route remain unchanged.

| File | Action |
|------|--------|
| `src/components/investor/InvestorSlides.tsx` | **REWRITE** — all 18 slides with the sharper investor-grade messaging |

The design language stays identical: white backgrounds, near-black type, gradient accents, clean tables, generous spacing. The content and messaging changes completely.

