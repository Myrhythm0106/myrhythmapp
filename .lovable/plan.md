## Goal

Add **"The Ideal-Brain Assumption"** as the named third problem across all brand, investor, and feature documentation, with verifiable stats and an explicit **4R feature map** (Remove / Reduce / Return / Reconnect) showing how every Founding Core feature addresses each problem group. No UI changes.

## The 4Rs (canonical vocabulary, used verbatim everywhere)

- **Remove** — stops the problem from happening (e.g. Capture removes "I forgot what the consultant said")
- **Reduce** — shrinks frequency, severity or cost (e.g. Calibrate reduces crash days)
- **Return** — helps recover ground already lost (e.g. Memory Bridge returns a conversation you thought was gone)
- **Reconnect** — rebuilds the support network and shared load, aligned with "No one walks alone" (Support Circle reconnects family, clinicians and caregivers around the person)

## Verified stats (locked, with primary sources)

- **Dementia:** 57M globally (2021); 78M by 2030; 139M by 2050 — WHO Global Status Report on Dementia (2021) + WHO Dementia fact sheet (2023–2025).
- **Adult ADHD:** 2.58% persistent (~139M) / 6.76% symptomatic (~366M) — Song et al., *Journal of Global Health*, 2021, doi:10.7189/jogh.11.04009.
- **Workplace stress:** 41% report high stress the previous day; 20% daily loneliness — Gallup *State of the Global Workplace* 2024.
- **Focus loss:** 2–3 hours uninterrupted focus/day; ~581 hours/year lost to distraction — Hubstaff 2026 + Economist Impact / Dropbox 2023.

Any claim without a citation in this list is cut.

## Deliverables (no UI changes)

1. **New memory** `mem://brand/third-problem-ideal-brain`
   - Standard wording block for "The Ideal-Brain Assumption"
   - Four audience blocks (ADHD, Dementia/MCI, Stress & Burnout, Productivity & Focus), each with: 2-line problem statement, cited stat, 4R feature map.

2. **Update `mem://brand/clinical-life-ready-gap`**
   - Add Problem 3 section
   - Add 4R consistency note (Reconnect is Support Circle's home column)

3. **Update `mem://index.md` Core**
   - Core thesis names all three problems and references the 4Rs.

4. **Rewrite `docs/myrhythm-one-page-pitch.md`** (investor)
   - Problem 3 block with cited stats table (superscript refs)
   - Canonical **4R feature matrix** (rows = features, cols = Remove/Reduce/Return/Reconnect)
   - Updated references section listing WHO, Song et al., Gallup, Hubstaff, Dropbox.

5. **Update `docs/founding-core-value-map.md`**
   - 4R canonical matrix (source of truth for all other docs)
   - Per-route paragraphs rewritten to use Remove / Reduce / Return / Reconnect verbs explicitly
   - Pain-to-price rows for the four new audiences.

6. **Update feature docs** (`docs/v0.1-features.md`, `docs/v0.1-friends-family-testing-guide.md`, `docs/v0.1-test-readiness.md`)
   - "Who this is for" paragraph (all three problems)
   - 4R tags on each Founding Core feature.

7. **Update GTM & user manual source markdown** with the same three-problem framing and 4R language. (PDFs regenerated out-of-band.)

8. **Update `src/config/appDescription.ts`** — content-only exports:
   - `THREE_PROBLEMS_SHORT`
   - `THIRD_PROBLEM_STATS` (with citation strings)
   - `FEATURE_4R_MAP` (Remove / Reduce / Return / Reconnect)
   No components consume these yet — landing-page UI is out of scope.

## 4R feature map (preview — full version lands in `founding-core-value-map.md`)

```text
Feature            Remove              Reduce              Return              Reconnect
Capture            missed info         recall effort       lost details        shares notes to Circle
Commit             decision paralysis  overwhelm           follow-through      aligns Circle on plan
Calibrate          crash days          symptom severity    good-day frequency  signals Circle early
Celebrate          demoralisation      dropout risk        sense of progress   Circle sees wins
Memory Bridge      "it's gone" moments retrieval time      lost conversations  family shares memory
Support Circle     isolation           caregiver overload  shared history      rebuilds the network
Assessments        guesswork           mis-scheduling      self-awareness      Circle understands needs
```

## Explicitly out of scope

New features, personas, assessments, UI changes, PDF regeneration, uncited stats.

## Open item

Name is **"The Ideal-Brain Assumption"** — say the word if you want a different label before I start.
