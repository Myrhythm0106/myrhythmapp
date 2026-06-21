## Goal

Make `/launch/assessment` carry real meaning: each of the 8 questions maps to one letter of **M-Y-R-H-Y-T-H-M**, every letter is framed around **brain health**, and every question is **tailored to the chosen persona**. Lay the foundation for a longitudinal **Brain Health Score** that grows over time.

## Letter → Question intent (brain-health framed)

| # | Letter | Word | Question intent | Brain-health lens |
|---|--------|------|-----------------|-------------------|
| 1 | **M** | Mindset | How you view your brain & capacity | Cognitive confidence / self-talk |
| 2 | **Y** | Yes to Reality | What's true right now, without judgment | Honest baseline |
| 3 | **R** | Rhythm | When your brain is clearest | Energy / peak window |
| 4 | **H** | Harness Support | Who's in your corner | Social scaffolding |
| 5 | **Y** | Your Victories | The kind of win that would feel meaningful | Reward & momentum |
| 6 | **T** | Transform | Biggest daily friction draining your brain | Cognitive load targets |
| 7 | **H** | Heal | What helps your brain reset | Restorative habits |
| 8 | **M** | Multiply / Meaning | What "feeling like myself" unlocks | Purpose & long-term motivation |

Each question stays single-tap (≤4 options, 56px targets), persona-specific wording, identical letter + lens across personas.

## Persona alignment (examples)

- **Brain-injury** — R: "When does your brain feel clearest?" · T: "What drains you fastest?"
- **Caregiver** — R: "When do you have your own bandwidth?" · T: "What drains you most as a carer?"
- **Executive** — R: "When is your deep-work window?" · T: "What erodes your focus?"
- **Student** — R: "When do you study best?" · T: "What gets in the way of learning?"

All 8 letters are authored per persona — no shared/generic fallback.

## Scoring system (v0.1, introduced now)

- Each option carries a `score` 0–3 (0 = high friction, 3 = strong brain-health alignment).
- Per-letter score = the option's score (multi-select = average).
- **Brain Health Score (BHS) = sum of 8 letter scores, normalised to 0–100.**
- Persisted in `myrhythm_launch_mode.brainHealthScore` plus a per-letter breakdown `letterScores: { M1, Y1, R, H1, Y2, T, H2, M2 }`.
- Shown on `/launch/welcome` as a single number + 8 mini-bars (one per letter). No medical claims — labelled "Your starting MYRHYTHM snapshot".

## File changes

1. **`src/data/launchAssessmentBanks.ts`** — rewrite to 8 letter-anchored questions × 4 personas, add `letter`, `word`, `brainHealthLens`, and per-option `score`. Keep `resolveHasSupport` + legacy persona map.
2. **`src/pages/launch/LaunchAssessment.tsx`** — render letter chip + word, brain-health lens caption, progress label "Letter {n} of 8 · MYRHYTHM". On finish, compute BHS + letter breakdown, store both new + legacy fields, navigate to `/launch/welcome`.
3. **`src/pages/launch/LaunchWelcome.tsx`** — surface the BHS snapshot (number + 8 bars + disclaimer).

No schema / routing / Supabase changes in this pass.

## Future development (added per request)

**Longitudinal Brain Health Score — doubling cadence**

- Every **6 months**, the question set per letter **doubles** (8 → 16 → 32 …) so the BHS becomes progressively more sensitive and capture-rich without overwhelming new users.
- Each wave is versioned: `assessment_version: 1 | 2 | 3 …`, with `wave_started_at` and `next_wave_due_at` on the user record.
- Scores are stored as time-series rows so we can show **trend lines per letter** (e.g. "Your R-Rhythm score climbed from 1.8 → 2.6 over 12 months").
- Reassessment is invitation-based (gentle nudge on Home, never blocking) and supports partial completion — user can answer one letter at a time.

**Future scope checklist**

- Supabase tables: `assessment_waves`, `assessment_responses`, `brain_health_scores` (RLS: user owns rows; clinician/support-circle read only if explicitly shared).
- Edge function `score-assessment` so weighting can evolve without client redeploys.
- Per-letter trendline component on `/launch/analytics` and a "MYRHYTHM Report" export (3pt confidentiality footer per project standard).
- Sync-Point: prompt for reassessment on meaningful life events (new diagnosis, role change, new caregiver) not just calendar 6-month tick.

## My thoughts / ideas (for your steer)

1. **Score language matters.** Avoid "good/bad". Use "your current rhythm signal" + neutral colour bars. Reinforces the no-medical-claims rule.
2. **Letter weighting may not stay equal.** Brain-injury cohort likely benefits from heavier R (Rhythm) and H (Heal) weights; executive cohort from T (Transform) and M-Mindset. Worth A/B-ing after wave 2.
3. **Tie BHS to the 4C loop.** Each letter could surface a default Capture/Commit prompt — e.g. low R score auto-suggests "Commit to a 20-min energy check-in". Makes the score *actionable* not just diagnostic.
4. **Caregiver duality.** Caregivers should be able to answer the 8 letters for **themselves AND** (optionally) for the person they care for — two parallel BHS tracks under one account. Aligns with existing `SubjectSwitch`.
5. **Doubling cadence risk.** 32+ questions can fatigue. Mitigate by chunking (1 letter per day for 8 days) and gamifying completion as a "MYRHYTHM tune-up".
6. **Clinical bridge.** Once BHS history exists, the Clinical Brief export becomes far more powerful — quantified self-report that complements clinician assessments without claiming to replace them.
7. **Privacy default.** BHS and per-letter scores should be **private by default**, with explicit per-letter share toggles to Support Circle. Brain-health data is sensitive.

## Out of scope (this pass)

- Reassessment UI, Supabase tables, trend visualisations, edge function, export — all parked for v0.2+ under the future-development plan above.
- Changes to personas, user-type page, Home copy, or Smart Schedule beyond the 4 legacy derived fields.
