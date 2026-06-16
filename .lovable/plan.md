# Plan v50 — /launch upgrade with universal framing

Builds on v49, but widens the scope so `/launch` lands the differentiator AND signals "this is for anyone whose life feels heavier than their plan."

## Guiding principle (new, addresses your concern)

The page must read as **"built rigorously for brain injury and memory recovery — and that's exactly why it works for anyone juggling a heavy life."** No persona gating on the surface. The clinical depth becomes a *quality signal*, not a *gatekeeper*.

Voice rules applied everywhere on `/launch`:
- Lead with a universal human moment (overwhelm, dropped plans, isolation, invisible effort).
- Name brain injury / memory recovery as the **proving ground**, not the **audience filter**.
- Use inclusive phrasing: "anyone carrying a lot," "anyone whose responsibilities outrun their energy," "built for recovery, useful for real life."
- Evidence and clinical rigor sit one layer deeper (Science page, deck), not in the headline.
- **No unverified claims.** Clinician involvement is not claimed anywhere on `/launch`.

## A. Differentiator line above the cards (new)

Single short block above the shift cards on `MVPCore4C.tsx`:

- Eyebrow: `Built for the discharge cliff. Useful for anyone carrying a lot.`
- Headline: `The gap between clinically ready and life-ready is where people fall.`
- Sub: `MyRhythm was built to close that gap for brain injury and memory recovery — and the same three shifts help anyone whose responsibilities outrun their energy.`

This names the thesis (Discharge Cliff / Clinical-Ready vs Life-Ready) without making non-clinical users feel excluded.

## B. Four shift cards, reordered (revised from v49)

Grid becomes `md:grid-cols-2 lg:grid-cols-4`. New order so accountability reframes the rest:

1. **Memory Bridge** — existing copy, lightly softened so it reads for "anyone who loses the thread," not only post-injury.
2. **You're never alone** *(new — moved from card 4 to card 2)*
   - Problem: `The people who care often don't know how to help.`
   - Tagline (brand-orange-500 italic): `Family, friends, clinicians — in the loop, on the day.`
   - Icon: `Users`
   - Micro-line: `Whether you're recovering, caregiving, or just stretched thin — a shared calendar means follow-through stops depending on willpower alone.`
3. **Energy Check** — existing copy, light tweak to universal language.
4. **Vision → Daily** — existing copy, light tweak.

Quiet evidence link (`See the evidence →` to `/launch/science`) stays under the grid.

Note: this is a marketing grid, not a decision screen — the "max 3 options" rule doesn't apply.

## C. Trust strip below the grid (new, thin, honest)

One row, low-visual-weight. Two items only — no unverified claims:
- `Founding Edition` badge (existing `EditionBadge`).
- `For recovery. For caregivers. For anyone carrying a lot.` ← the inclusivity signal in plain sight.

No "built with clinicians," no "clinical input," no fake testimonials. Placeholders are honest, not fabricated.

## D. Science page — 4th section (from v49, framing tightened)

`LaunchScience.tsx` gets a new section:
- Generic problem: `Doing it alone is the hardest part.`
- Universal lead sentence: `Isolation and invisible effort hurt recovery — and they hurt anyone trying to keep a hard week on track.`
- Three placeholder stats with `[citation pending]`: ~65% loneliness, 2–3× follow-through with visibility, ~40% caregivers don't know what would help.
- "What MyRhythm does about it" panel: Support Circle, shared calendar invites, permissioned views, gentle nudges.
- Medical disclaimer + confidentiality footer unchanged.

## E. Investor deck — Slide 22 (from v49, unchanged)

`InvestorSlides.tsx` + `InvestorDeckPage.tsx`:
- "Accountability is the moat" — stat-led.
- Headline: `2–3× follow-through` when plans are visible to a trusted person.
- Bullets: caregiver burnout, clinician handoff failures, isolation as relapse driver.
- Positioning: competitors solve cognition in isolation; MyRhythm extends the loop to family, friends, clinicians with permissioned calendar visibility.
- `TOTAL_SLIDES` 21 → 22.

The deck stays sharper / more clinical than `/launch` — investors want the wedge; users want the welcome.

## Out of scope
- No data model changes (Support Circle stays as-is).
- No new imagery.
- No real testimonials or pilot numbers — placeholders only, clearly marked.
- No persona routing changes.
- **No claims of clinical partnership, clinician review, or medical endorsement.**

## Technical notes
- Files touched: `src/components/mvp/MVPCore4C.tsx`, `src/pages/launch/LaunchScience.tsx`, `src/components/investor/InvestorSlides.tsx`, `src/pages/InvestorDeckPage.tsx`.
- Re-uses `EditionBadge`, lucide `Users` icon, existing card primitives and design tokens. No new dependencies.
- All copy uses brand-orange-500 italic only on taglines, matching the established three-voice pattern.

## How this answers your worry
The Discharge Cliff and brain-injury origin become a **credibility story** ("this was built where the stakes are highest"), while every card, the trust strip, and the science intro explicitly extend the invitation to caregivers, busy professionals, ADHD-adjacent users, and anyone stretched thin. No surface on `/launch` says "only for brain injury" — but every surface says "rigorous enough for brain injury." And no claims are made that aren't true right now.