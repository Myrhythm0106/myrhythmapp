
## What you'll see

Replace the current bland "Explore Memory Bridge / Calendar / Calibrate / Community" row on `/launch` with a refined, progressively-revealed card set that carries supporting facts and clear expectations — with facts and value framed for **everyone**, not just people living with a brain injury.

**Default (calm & scannable):** each card shows only
- Soft icon medallion (kept in current brand-tinted gradients)
- Numbered eyebrow (01 · Capture, 02 · Commit, 03 · Calibrate, 04 · Celebrate)
- Short headline ("Your Memory Bridge", etc.)
- One evocative, universal hook line
- Subtle "See how it works ⌄" affordance

**On tap/click (roll-up reveal):** the card expands in place using `Collapsible` + height/opacity transition. Content is grouped so the universal value is on top and the clinical context sits beneath, clearly labelled:

1. **Who it's for** — one line: "For anyone juggling a busy brain — parents, professionals, students, carers, and people recovering from injury, ADHD, MCI, or burnout."
2. **What it does for you** — 3 short icon+phrase bullets in everyday language.
3. **The facts behind it** — 2–3 evidence chips split into two sub-labels:
   - `Everyday brains` — general-population facts (memory, attention, stress, sleep, social support).
   - `Also helpful if…` — the brain-injury / ADHD / MCI / caregiver stats already approved in `THIRD_PROBLEM_STATS` and the discharge-cliff doc.
4. **What you can expect** — 2–3 concrete, universal outcome lines (no cure/treatment promises).

Then the existing primary CTA ("Explore Memory Bridge" → `/launch/capture`, etc.), styled softer.

Accordion behaviour — only one card open at a time. Fully keyboard + screen-reader accessible (`aria-expanded`, focus ring, 56px+ tap target preserved).

Above the grid, section subheading softens to one line: **"Built for every busy brain — and strong enough for the hardest days."** Small hint: "Tap a card to see the facts and what to expect."

## Copy (routes/CTA labels unchanged)

**01 Capture — Memory Bridge**
- Hook: "Never lose the conversation that mattered."
- Who it's for: meetings, doctor visits, school pickups, family plans — anyone who can't hold every detail in their head.
- Does for you: records any chat • pulls out names, decisions and next steps • searchable months later.
- Facts — Everyday brains: "People forget ~50% of new information within an hour, and ~70% within 24 hours (Ebbinghaus)."¹ · "Knowledge workers lose ~2 hrs/day to interruptions and context-switching."²
- Facts — Also helpful if…: "~40–80% of medical information is forgotten immediately after a consultation; nearly half of what's remembered is remembered incorrectly."³
- Expect: a rolling recorder, a plain-English summary per recording, and a follow-up list you can act on.

**02 Commit — MyRhythm Calendar**
- Hook: "A day that fits the brain you have today."
- Who it's for: anyone whose calendar keeps winning against them — new parents, shift workers, founders, students, carers.
- Does for you: energy-aware planning • gentle nudges • one thread from vision → today.
- Facts — Everyday brains: "Cognitive performance can swing 20–30% across the day based on chronotype and sleep."⁴ · "Task-switching can cost up to 40% of productive time."²
- Facts — Also helpful if…: "Cognitive fatigue peaks in the first 6 months after brain injury; 1 in 3 survivors are readmitted within 90 days of discharge."⁵
- Expect: your goals broken into low-effort actions, scheduled around your energy pattern, not against it.

**03 Calibrate — Check-ins**
- Hook: "A 20-second check-in. A clearer week."
- Who it's for: anyone who wants to feel their week instead of just survive it.
- Does for you: mood + energy in one tap • quiet pattern insight • no scoring, no streaks to fail.
- Facts — Everyday brains: "Brief daily self-monitoring is linked with 2–3× better follow-through on personal goals."⁶ · "Naming a feeling ('affect labeling') measurably reduces stress reactivity."⁷
- Facts — Also helpful if…: "Up to 1 in 2 stroke survivors experience depression in the first year; early self-monitoring supports earlier support-seeking."⁸
- Expect: a weekly Lens view of your rhythm, gentle flags when patterns shift, never a score you can 'fail'.

**04 Celebrate — Support Community**
- Hook: "No one walks alone."
- Who it's for: anyone who does better with a small, honest circle — friends, family, colleagues, or a care team.
- Does for you: share wins • ask the circle • encouragement, not advice.
- Facts — Everyday brains: "Strong social connection is associated with a ~50% lower risk of early mortality (Holt-Lunstad meta-analysis)."⁹ · "Loneliness raises the risk of depression roughly 2×."¹⁰
- Facts — Also helpful if…: "Engaged support circles are linked to lower caregiver burnout and better 12-month recovery outcomes."¹¹
- Expect: a private circle of 1–5 people, one-tap wins, and templates for the messages that are hardest to write.

All 11 footnotes render once below the grid in `text-xs text-brain-health-500`, sourced from `THIRD_PROBLEM_STATS`, `docs/discharge-bridge-kit.md`, and widely-cited public research (Ebbinghaus, Holt-Lunstad, APA on task-switching, Lieberman on affect labeling). No new medical claims about MyRhythm itself.

## Visual refinements

- Remove `hover:scale-105`; use soft shadow lift + 1px inner ring on hover/expand.
- Left-aligned composition inside each card (editorial, not template).
- Numbered eyebrow in the same uppercase tracked style as `SectionHeader` / `CapabilityHero`.
- Fact chips: `bg-brain-health-50 border border-brain-health-100 text-brain-health-700 text-xs`. Sub-label ("Everyday brains" / "Also helpful if…") in tiny uppercase tracked text above each chip group.
- Expectations rendered with a check-glyph in the card's own accent colour.
- New universal-value badge on each card header: small pill "For every busy brain" to make the non-clinical audience obvious at a glance.

## Scope

- **Edit only:** `src/components/mvp/MVPCore4C.tsx` — the "Four Core Solutions" block.
- **Reuse:** `Collapsible`, `Card`, `Button`, lucide icons, existing brand-token gradients, existing fact strings from `THIRD_PROBLEM_STATS` / `docs/discharge-bridge-kit.md`.
- **Preserve:** all four onClicks — `/launch/capture`, `/launch/commit`, `/launch/calibrate`, `setActiveFeatureModal('community')`.
- **Untouched:** routing, other sections, memory files, medical-disclaimer policy.

## Technical notes

- Local state: `const [openCard, setOpenCard] = useState<null | 'capture' | 'commit' | 'calibrate' | 'celebrate'>(null)`.
- Extract a local `SolutionCard` sub-component: props `id`, `eyebrow`, `title`, `hook`, `audience`, `bullets`, `factsEveryday`, `factsAlsoHelpful`, `expectations`, `icon`, `gradient`, `ctaLabel`, `onCta`, `open`, `onToggle`.
- `Collapsible` / `CollapsibleTrigger` / `CollapsibleContent` from `@/components/ui/collapsible`; chevron rotates via `group-data-[state=open]:rotate-180`.
- Grid stays `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start`.
- One footnote list rendered beneath the grid; superscripts inside cards link (`<a href="#fact-1">…`) to those anchors.
- No new dependencies, no new colour utilities.

## Not doing

- No new medical/statistical claims about MyRhythm's outcomes.
- No new animation libraries.
- No changes to CTA destinations, community modal, other sections, or roadmap.
