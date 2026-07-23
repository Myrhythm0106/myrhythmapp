## Goal
Produce a single strategic reference doc that ranks every feature shipped or improved in this sprint against (a) the value it delivers, (b) the three problem definitions (Discharge Cliff, Clinical-Ready vs Life-Ready Gap, Ideal-Brain Assumption), and (c) known competitors — so you can use it for founder decisions, investor conversations, and v0.2 prioritisation.

## Deliverable
New file: `docs/feature-value-ranking.md` (living doc, updated per sprint). No code changes.

## Structure of the doc

### 1. Scoring model (transparent, 1–5 each)
- **Problem Fit** — how directly it closes Discharge Cliff / Life-Ready Gap / Ideal-Brain Assumption
- **User Value** — "would a Founding Member notice if it disappeared tomorrow?"
- **Competitive Moat** — can Calm/Headspace/MyReha/CogniFit/Neuronation replicate in <3 months?
- **v0.1 Readiness** — is it demo-ready today, or still fragile?
- **Composite** = sum, ranked into Tier S / A / B / Defer

### 2. Feature inventory (this sprint's shipped + improved)
Grouped by 4C surface:
- **Capture / Memory Bridge**: 4h recording cap, live countdown, Save & Extract fix, document import (ephemeral), source-quote reveal, accuracy checkbox + audit log, Loop-In picker, Support Circle CRUD
- **Commit / Calendar**: LaunchDailyBrief, LaunchRescheduleModal, Google/Outlook sync bar, push tracking, Add Event upgrades (Meeting type, reminders, invites, recurrence), smart scheduling with MYRHYTHM-aware suggested dates
- **Calibrate / Growth**: MyRHYTHM-G 8-state layer, Amen/Leaf alignment, home chip, Support Circle visibility
- **Continuity / Navigation**: You-Are-Here dial (gated post-payment), assessment Phase 0 + "None of these fit me", results page redesign with interactive letter bars
- **Trust / Commercial**: Emerald Prestige theming, Founding Member CTA, tester bundle (access codes + Stripe test mode), card-on-file trial, Back-to-results from payment

### 3. The ranking table
One row per feature with the 4 scores, composite, tier, and a one-line "why this rank". Sorted highest → lowest.

### 4. Problem-coverage matrix
Grid: rows = features, columns = the 3 problems. Marks direct / indirect / none. Shows at a glance where we're thin (expected: Ideal-Brain Assumption is under-served in v0.1 vs Discharge Cliff which is over-served).

### 5. Competitor delta
Short table: for each Tier S/A feature, name the closest competitor equivalent and what makes ours defensible (usually: Support Circle integration + clinical-export + Memory-First Design). Flags features where a competitor is genuinely ahead so we don't kid ourselves.

### 6. Recommendations
- Which Tier S features to hero in the investor Loom and landing copy
- Which Tier B features to quietly de-emphasise until v0.2
- Which gaps the ranking exposes that should reshape the v0.2 backlog (esp. Discharge Bridge Kit, Bring-a-Witness, Discharge Summary → Life-Ready Plan)
- Honest call-outs where we've over-built vs the problem

## Notes
- Pure strategy artefact — no code, no schema, no UI changes.
- Anchored to the locked problem definitions in `mem://brand/clinical-life-ready-gap` and `mem://brand/third-problem-ideal-brain`, and the competitor set in `docs/problem-fit-and-market.md` and `docs/market-evidence.md`.
- I'll be candid where a shipped feature scores low — the point of the doc is decisions, not applause.
