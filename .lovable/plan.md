## Inclusive Design Pass — v5 (Memory-First Design brand mark)

### Positioning
**Memory-First Design™** — the visible brand descriptor for the philosophy that everything else lives underneath.

Priority order (used verbatim in docs and About):
1. **Memory challenges first** — people rebuilding after a brain injury or stroke
2. **Older population** — adults managing full lives at 65+
3. **Anyone with a busy or tired brain** — ADHD, stress, caregivers, students, professionals

Everyone benefits because we designed for the hardest case first.

### What's visible in the app
"Memory-First Design" appears as a **signature**, not a label — sparingly and confidently, never on functional UI:
- Small chip near the logo on `/launch/welcome`
- Footer tagline: *"Built with Memory-First Design."*
- One About-page paragraph explaining what it means

All existing 4C labels (Capture / Commit / Calibrate / Celebrate) and door copy **remain unchanged**. No "Supporter" sweep, no Simple Mode toggle, no read-aloud button.

---

## Phase 1 — Documentation & positioning

### 1.1 `src/config/appDescription.ts`
Add (existing `APP_DESCRIPTION` stays):
```ts
export const APP_DESCRIPTION_INCLUSIVE =
  "MyRhythm is designed for memory challenges first — for people rebuilding after a brain injury or stroke. Secondly for the older population. Thirdly so that anyone with a busy or tired brain benefits. Planning, prioritisation, reminders, emotional check-ins, and everyday follow-through. Works on any phone, tablet, or laptop.";

export const MEMORY_FIRST_DESIGN_TAGLINE = "Built with Memory-First Design.";

export const MEMORY_FIRST_DESIGN_EXPLAINER =
  "Memory-First Design means we designed for the hardest case first: someone rebuilding after a brain injury, stroke, or living with memory challenges. Then for the older population managing full lives. Then for anyone with a busy or tired brain. If it works clearly for them, it works beautifully for everyone.";
```
Consumed by: About page, Cheat Sheet, investor deck, GTM one-pager, README.

### 1.2 README + About + Marketing sweep
- `README.md` — top-of-file positioning uses the 3-tier description verbatim
- `src/pages/launch/LaunchEditionAbout.tsx` — long-form section renders `APP_DESCRIPTION_INCLUSIVE` + `MEMORY_FIRST_DESIGN_EXPLAINER`
- Any handbook/GTM/investor markdown under `/docs` or `/mnt/documents` — swap intro to the 3-tier framing

### 1.3 Investor / strategy language
Retain the 4R vocabulary (Remove / Reduce / Return / Reconnect). Add one positioning line to the deck:
> "Our moat is a design philosophy: **Memory-First Design**. Nobody credible is designing for a 72-year-old stroke survivor. We are — which is why we work for the 32-year-old with ADHD."

---

## Phase 2 — Minimal visible signature

### 2.1 "Memory-First Design" chip
- New: `src/components/launch/MemoryFirstChip.tsx` — small pill, glass-morphism styling per existing tokens, no icon overkill
- Placement: near the logo on `/launch/welcome` only (one location)
- Copy: "Memory-First Design"
- Tooltip on hover/tap: `MEMORY_FIRST_DESIGN_EXPLAINER` (short version)

### 2.2 Footer tagline
- Update the existing launch footer (find via `rg "©|footer" src/components/launch`) to append: *"Built with Memory-First Design."*
- Same size and treatment as existing footer text — no highlight

### 2.3 About page paragraph
- `LaunchEditionAbout.tsx` gets one new section titled **"Memory-First Design"** rendering the explainer + 3-tier description. Above existing About content, below the hero.

**No changes to:** 4C tiles, doors, navigation, settings, calendar, capture flows, persona copy.

---

## Phase 3 — Silent design guardrails

Applied globally, unlabelled — quality defaults, not "accessibility mode":
- Body text minimum 16px on mobile across `/launch/*`
- Primary tap targets ≥ 56px (audit for drift from existing Core rule)
- Line-height ≥ 1.5 on body
- WCAG AA contrast (4.5:1) audit on glass-morphism panels; fix any misses
- Max 3 primary choices per screen (audit)

No user-facing toggle. No badging. Same premium interface for everyone.

---

## Phase 4 — Cheat Sheet v2

Rebuild PDF + DOCX to `/mnt/documents/`:
- Cover: title + **"Built with Memory-First Design"** subline
- Opening paragraph = `APP_DESCRIPTION_INCLUSIVE` (verbatim)
- Second paragraph = `MEMORY_FIRST_DESIGN_EXPLAINER`
- In-app terms (Capture / Commit / Calibrate / Celebrate) preserved verbatim
- Body 12pt, proportional headings
- Trust strip: "Works on any phone, tablet, or laptop — native iOS and Android with v0.2"
- Human-fallback line: "If you get stuck, tap the help button or ask someone you trust to read this with you."
- Verbatim `DISCLAIMER_TEXT`, 3pt confidential footer
- 150 DPI QA on every page

Outputs: `MyRhythm_QuickStart_CheatSheet_v2.pdf` + `.docx`

---

## Phase 5 — Project memory

New:
- `mem://brand/memory-first-design` — the brand mark, the 3-tier priority order (verbatim), where it appears in the UI (chip + footer + About only), and the rule that in-app functional labels never carry it
- `mem://ux/inclusive-design-first` — silent guardrails: 16px body floor, 56px primary tap targets, WCAG AA contrast, max 3 primary choices, no visible "senior mode"

Update `mem://index.md` — add both references. Add to Core:
> "Memory-First Design™ is the visible brand descriptor. In-app functional labels (Capture/Commit/Calibrate/Celebrate, doors, persona copy) stay as-is. 'Memory-First Design' appears only as a chip near the logo, a footer tagline, and one About-page section."

---

## Phase 6 — Vision doc (parked)

Add to `VISION.md` under **"Future — Post-Discharge Resource Hub"**:
> A `/launch/resources` route with three tabs — **Local support**, **For the person supporting you**, **What next** — addressing the Discharge Cliff. Parked pending a curation partnership with regional brain-injury associations, NHS ICBs, or state agencies. Dallas pilot data preserved in `src/data/localServicesData.ts`. Revisit post-v0.2.

Vision-only. No code, no data.

---

## Explicitly NOT doing
- ❌ No 4C label swaps (Capture / Commit / Calibrate / Celebrate stay)
- ❌ No "your person / teammate" → "Supporter" rewrite
- ❌ No `LaunchUserType.tsx` door restructure
- ❌ No Simple Mode toggle in Settings
- ❌ No read-aloud button
- ❌ No priority-loop / Today's Focus UI changes
- ❌ No new packages, no DB migration

## Deliverables
1. `src/config/appDescription.ts` — 3 new exports (INCLUSIVE, TAGLINE, EXPLAINER)
2. `src/components/launch/MemoryFirstChip.tsx` + wire into `/launch/welcome`
3. Launch footer tagline
4. `LaunchEditionAbout.tsx` new section
5. `README.md` + docs sweep
6. Global CSS floor: 16px body on mobile, tap-target + contrast audit
7. `/mnt/documents/MyRhythm_QuickStart_CheatSheet_v2.pdf` + `.docx`
8. Two new memory files + `mem://index.md` update
9. `VISION.md` entry for Resource Hub
