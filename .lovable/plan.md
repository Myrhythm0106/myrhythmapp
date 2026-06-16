Three coordinated surfaces, one truth — empathy on the app, evidence in the science page, market-sizing in the deck.

---

## 1. Rewrite the three shift cards in `src/components/mvp/MVPCore4C.tsx` (lines 198-215)

Replace stat-led problem titles with **generic, empathetic problem statements** + the orange italic "One..." tagline. No numbers on the card face.

### Card 01 — Memory
- **Problem (h3):** `Conversations fade faster than they should.`
- **Tagline (orange italic):** `One conversation/memory you can always find`
- **Body:** unchanged ("Memory Bridge listens so you don't have to...")

### Card 02 — Overwhelm
- **Problem (h3):** `Some days, choosing what to do next is the hardest part.`
- **Tagline (orange italic):** `One calm next step defined daily`
- **Body:** unchanged ("A quick Energy Check tunes the day...")

### Card 03 — Vision to Action
- **Problem (h3):** `Goals that matter often never reach today.`
- **Tagline (orange italic):** `One thread from dream to today`
- **Body:** unchanged ("Vision → Goals → Priorities → Daily Actions...")

### Quiet evidence link below the grid
Under the 3-card grid, add a single understated line, centered:
`The evidence behind this →` linking to `/launch/science`.
Styling: `text-sm text-brain-health-600 hover:text-brand-orange-500 underline-offset-4 hover:underline`.

### Styling reminders
- Problem `h3` keeps `text-lg font-bold text-brain-health-900`.
- Tagline: `text-base font-semibold italic text-brand-orange-500 mb-2`, placed between h3 and body.
- No other layout/spacing/color changes.

---

## 2. New page: `src/pages/launch/LaunchScience.tsx` (route `/launch/science`)

A calm, evidence-led page that holds the stats removed from the cards. Three sections mirroring the three cards, each with:
- Section title (the generic problem from the card)
- Stat block (large numeral + 1-line caption)
- 2-3 sentence plain-language explanation, framed as a shared human challenge — never as the user's deficit
- Citation footnote (study / source name; we'll mark `[citation needed]` where we don't yet have a verified source so the user can fill in)
- A small "What MyRhythm does about it" panel that points back to the matching feature

### Stat content per section

**Section 1 — Conversations fade faster than they should**
- Stat: `~50%` lost within an hour
- Frame: the forgetting curve is universal; brain injury and cognitive overload steepen it. The cost isn't the forgetting itself — it's the names, promises and next steps that go with it.
- Source placeholder: Ebbinghaus forgetting curve research [citation to be confirmed]
- Feature link: Memory Bridge

**Section 2 — Some days, choosing what to do next is the hardest part**
- Stat: `~35,000` decisions per day (commonly cited figure for adults)
- Frame: every decision spends energy. After brain injury, the energy budget is smaller and every choice costs more — so "what next?" can be the heaviest question on the list.
- Source placeholder: Cornell / decision fatigue research [citation to be confirmed]
- Feature link: Energy Check + Smart Schedule

**Section 3 — Goals that matter often never reach today**
- Stat: `~92%` of personal goals never reach completion (commonly cited Statistic Brain figure)
- Frame: the will is there. The bridge between vision and today's action is what's missing — for everyone, and especially when cognitive load is high.
- Source placeholder: goal-completion research [citation to be confirmed]
- Feature link: Vision → Goals → Priorities → Daily Actions

### Page chrome
- Header: `The evidence behind MyRhythm`
- Subhead: `These are shared human challenges — not personal failings. Here's the research, and what we do about it.`
- Medical disclaimer footer (per project policy): "MyRhythm does not diagnose, treat, or cure any condition."
- Document confidentiality 3pt footer per project standard.

### Wire up
- Add route in the router (find where other `/launch/*` routes are registered, add `science` route pointing at `LaunchScience`).
- Add export in `src/pages/launch/index.ts`.

---

## 3. Investor deck update — `src/pages/InvestorDeckPage.tsx`

Add (or update if a problem slide exists) a **"The problem, by the numbers"** slide using the stat-led voice — same three truths, framed for investors:
- `50% of a conversation lost within the hour` → memory continuity gap
- `35,000 decisions per day` → cognitive load / overwhelm market
- `92% of personal goals never completed` → vision-to-action gap
- Closing line: `MyRhythm is the bridge across all three.`

Keep existing deck styling; insert as a new slide in the existing flow (I'll find the right index when implementing).

---

## 4. Verification
- Reload `/launch` → cards show generic empathetic problems + orange "One..." taglines, no numbers visible, quiet "evidence behind this →" link present.
- Click the link → lands on `/launch/science` with three stat sections + disclaimer.
- Open `/investor-deck` (or wherever `InvestorDeckPage` mounts) → new stat slide present.
- No console errors; no layout regressions on the MVPCore4C page.

---

## Out of scope (intentionally)
- No copy changes to the existing `PainPointImageCard` row above (lines 167-184) — leaving those alone unless you ask.
- No design system changes.
- No new images generated for the science page in this pass (clean typographic layout). Can add hero imagery in a follow-up if you want.