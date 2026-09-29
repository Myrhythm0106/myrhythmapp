# Brain-Health Habit Questions: Reference Log

INTERNAL DOCUMENT. Not shown in the app.

The five everyday habit questions in the assessment (`HABIT_QUESTIONS` in `src/data/launchAssessmentBanks.ts`) are based on the published brain-health material of **Dr Daniel G. Amen**. The founder is a certified Amen Brain Health Coach. Each question carries a `// ref BH-xx` comment in the code that matches a row below, so every question can be traced to its source.

## Rules
- **In-app:** no practitioner, clinic or programme names. The questions are phrased as everyday habits and are never presented as a medical test (see `docs/claims-policy.md`).
- **Original wording:** all questions and options are written by MyRhythm. They are not copied from any proprietary Amen Clinics questionnaire or scored instrument.
- **Not a diagnosis:** the results only shape the timing and pacing suggestions. They never diagnose, and the user can override every suggestion.

## Source framework
The **BRIGHT MINDS** risk-factor model, first set out in *Memory Rescue* (Amen, 2017). It is developed further in *The End of Mental Illness* (2020) and *Change Your Brain Every Day* (2023). The underlying brain-health habits come from *Change Your Brain, Change Your Life* (revised edition 2015) and *Use Your Brain to Change Your Age* (2012).

| Ref | App question (plain) | BRIGHT MINDS factor(s) | Amen source material | How the answer is used |
|---|---|---|---|---|
| BH-01 | How do most nights go for you? | **S**: Sleep | *Memory Rescue*, ch. "S is for Sleep"; *Change Your Brain Every Day* (sleep habits) | Uneven nights: longer gaps between things, late evenings kept clear. Also counts towards the biological pillar |
| BH-02 | How often do you get moving in a normal week? | **B**: Blood flow | *Memory Rescue*, ch. "B is for Blood Flow"; *Use Your Brain to Change Your Age* (exercise) | Biological pillar, which sets the length of the protected window and the focus blocks |
| BH-03 | What does a typical day of eating and drinking look like? | **I**: Inflammation · **D**: Diabesity · **T**: Toxins (hydration) | *Memory Rescue*, chs. I / D; *The Brain Warrior's Way* (2016) nutrition | Biological pillar |
| BH-04 | Which of these sounds most like you right now? (smoking, alcohol, helmets/seatbelts) | **H**: Head trauma · **T**: Toxins | *Memory Rescue*, chs. H / T; *Change Your Brain, Change Your Life* (protect your brain) | Biological pillar |
| BH-05 | When worries or stress show up, what usually happens? | **M**: Mind storms · **N**: Neurohormones (stress) · **R**: Retirement/aging (curiosity) | *Change Your Brain, Change Your Life* (ANTs, i.e. automatic negative thoughts, and questioning the thought); *The End of Mental Illness* | Psychological pillar, which sets how many demanding items go in one day. "Racing thoughts" adds a calm-down slot suggestion |

## Deliberately not asked
- **G (Genetics)** and **Immunity/infections:** these are medical-history questions. They are out of scope under the no-medical-claims policy.
- Existing questions already cover part of the model. **R (Retirement/aging: purpose and learning)** is partly covered by the MYRHYTHM "Meaning" question. **Head trauma history** is covered by the brain-injury path's "When did this happen?" question.

## Change control
If you change any habit question, update this table and the `// ref` comment together. Bump `BrainHealthScore.version` when scoring changes.
