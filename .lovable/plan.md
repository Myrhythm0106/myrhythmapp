# Regenerate GTM Playbook + User Manual with the latest thesis

## Why
The PDFs you're viewing are stale:
- `MyRhythm_GTM_Playbook_v3.pdf` — last written **23 June 2026**
- `MyRhythm_UserManual_FoundersEdition_v2.pdf` — last written **23 June 2026**

The recent work updated **markdown source files and `appDescription.ts` only**. These two PDFs were generated directly (no markdown source in `docs/`), so they never picked up:
- The third problem — **"The Ideal-Brain Assumption"**
- The **4R framework** (Remove / Reduce / Return / Reconnect)
- Verified stats (WHO 57M/78M/139M dementia; Song et al. 2021 adult ADHD 2.58%/6.76%; Gallup 2024 stress; Hubstaff 2026 + Dropbox 2023 focus)
- The 4R feature map (Capture, Commit, Calibrate, Celebrate, Memory Bridge, Support Circle, Assessments)

## What I'll produce

Two new versioned artifacts written to `/mnt/documents/` (originals kept untouched):

1. **`MyRhythm_GTM_Playbook_v4.pdf`** (+ `.docx`)
2. **`MyRhythm_UserManual_FoundersEdition_v3.pdf`** (+ `.docx`)

Both will carry the standard 3pt confidentiality footer per project memory.

## Content changes

**GTM Playbook v4** — add/refresh:
- "The Three Problems MyRhythm Solves" section (Discharge Cliff, Clinical-Ready vs Life-Ready Gap, **Ideal-Brain Assumption**) with cited stats
- Audience blocks: ADHD, Dementia/MCI, Stress/Burnout, Focus/Productivity — each mapped to which 4Rs apply
- 4R feature matrix table (feature × Remove/Reduce/Return/Reconnect)
- Refreshed positioning line + "No one walks alone" Reconnect callout
- Keep existing GTM channels/pricing/rollout sections; edits are additive

**User Manual Founders Edition v3** — add/refresh:
- "How MyRhythm helps" reframed as the 4Rs, with one-line examples per feature
- "Who this is for" audience blocks matching the docs
- Feature walkthroughs (Capture, Commit, Calibrate, Celebrate, Memory Bridge, Support Circle) tagged with their 4R contributions
- Support Circle section highlights **Reconnect** and "No one walks alone"
- Medical disclaimer preserved verbatim

## Sources of truth I'll pull from (already in the repo)
- `mem://brand/third-problem-ideal-brain`
- `mem://brand/clinical-life-ready-gap`
- `src/config/appDescription.ts` (`THREE_PROBLEMS_SHORT`, `THIRD_PROBLEM_STATS`, `FEATURE_4R_MAP`)
- `docs/myrhythm-one-page-pitch.md`
- `docs/founding-core-value-map.md`
- `docs/v0.1-features.md`

## QA
Convert every page of both PDFs to images and visually inspect each one for clipping, overflow, missing footer, broken tables. Fix and re-run until clean before handing over.

## Out of scope
- Regenerating the CCM/Productivity investor decks (say the word and I'll do those next as v5 / v2)
- Any code, UI, or `docs/*.md` changes — those are already done
- New stats beyond the already-cited set
