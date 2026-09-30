# Brain-Health Questions: Reference Log

INTERNAL DOCUMENT. Not shown in the app.

The eight everyday questions in `src/data/launchAssessmentBanks.ts` use original MyRhythm wording grounded in approved public brain-health source material. Each carries a `// ref BH-xx` code matching one row below.

## Rules
- No practitioner, clinic or programme names appear in the app, snapshot, code comments or this log.
- Questions are everyday self-reflection, not a medical test or risk prediction.
- MyRhythm does not reproduce a proprietary questionnaire or scoring method.
- Planning preferences are separate from the brain-health reflection and are not health-scored.

## Sources
- *Memory Rescue* (2017), ISBN 9781101988493.
- *Change Your Brain, Change Your Life*, revised edition (2015), ISBN 9781101904640.
- *Use Your Brain to Change Your Age* (2012), ISBN 9780307888938.
- *The End of Mental Illness* (2020), ISBN 9781496438153.
- *Change Your Brain Every Day* (2023), ISBN 9781496454573.

## Question traceability

| Ref | Exact app question | Source topic | Source locator | How MyRhythm uses it |
|---|---|---|---|---|
| BH-01 | How do most nights go for you? | Sleep and restorative habits | *Memory Rescue*, sleep chapter; *Change Your Brain Every Day*, sleep material | Everyday-habits score; uneven nights add more room between plans |
| BH-02 | How often do you move your body in a usual week? | Movement and circulation | *Memory Rescue*, blood-flow chapter; *Use Your Brain to Change Your Age*, movement material | Everyday-habits score; helps pace the suggested focus window |
| BH-03 | What are food and drinks like on a usual day? | Food, hydration and metabolic habits | *Memory Rescue*, inflammation and blood-sugar chapters | Everyday-habits score only |
| BH-04 | How consistently do you protect your head? | Avoiding head injury | *Memory Rescue*, head-trauma chapter; *Change Your Brain, Change Your Life*, protection material | Everyday-habits score only |
| BH-05 | Which answer is closest to your usual week? | Smoking, alcohol and avoidable exposure | *Memory Rescue*, toxins chapter | Everyday-habits score only |
| BH-06 | When stress builds, what usually happens? | Stress response and settling busy thoughts | *Change Your Brain, Change Your Life*, thought-pattern material; *The End of Mental Illness*, stress material | Everyday-habits score; a racing-mind answer adds an optional settling pause |
| BH-07 | How often do you learn something or connect with someone you trust? | New learning and social connection | *Memory Rescue*, aging and learning chapter | Everyday-habits score and social picture |
| BH-08 | How often does your week include something that matters to you? | Purpose and positive routines | *Memory Rescue*, meaning and aging material | Everyday-habits score and purpose picture |

## Deliberately excluded
- Genetics, immunity, hormone levels, infections and diagnosed conditions are medical-history areas and are not asked or scored.
- The questions do not estimate the likelihood of dementia, Alzheimer’s disease or any other condition.
- Best time, focus length, energy drains, support and weekly goal are planning preferences. They shape advisory scheduling but do not affect the everyday brain-health score.

## Change control
Change the matching row and `// ref` code together whenever question wording changes. Bump `ASSESSMENT_SCHEMA_VERSION` whenever questions or scoring change.