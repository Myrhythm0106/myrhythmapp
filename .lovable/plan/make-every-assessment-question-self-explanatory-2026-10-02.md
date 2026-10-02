# Make every assessment question self-explanatory

Rewrite the question titles in `src/data/launchAssessmentBanks.ts` so each one is instantly clear in plain English — no re-reading needed. Scoring, answer options, and order stay the same.

## Title changes

| Now | Becomes |
|---|---|
| How do most nights go for you? | **How well do you sleep at night?** |
| How often do you move your body in a usual week? | How often do you move your body each week? |
| What are food and drinks like on a usual day? | **How well do you eat and drink on a usual day?** |
| How consistently do you protect your head? | **How often do you protect your head?** (seatbelts, helmets, avoiding knocks) |
| Which answer is closest to your usual week? | **How often do you smoke or drink alcohol?** |
| When stress builds, what usually happens? | **What usually happens when you feel stressed?** |
| How often do you learn something or connect with someone you trust? | **How often do you learn something new or spend time with someone you trust?** |
| How often does your week include something that matters to you? | **How often do you do something that really matters to you?** |
| At what time of day do thinking and everyday tasks usually feel easiest? | **What time of day do you think and get things done most easily?** |
| What pace works for you? | **How do you work best?** (with the two rows: focus length, energy drains) |
| Who, if anyone, may support you? | **Who would you like to support you?** |
| What would make this week feel better or more manageable? | **What would make this week feel easier?** |

## Rules

- One clear question per title; the helper line underneath only adds reassurance, never explains the question itself.
- No jargon, no scores mentioned, no practitioner names.
- Subtitles updated only where the new title already covers the old subtitle (avoid repetition).

## Brain-health and quadrant alignment

All eight scored questions already sit on the four quadrants and match the internal source log, so the alignment is preserved rather than changed:

| Quadrant | Questions | Internal topic |
|---|---|---|
| Biological — Body & energy | Sleep, Movement, Food & drink, Head protection, Smoke/alcohol | Sleep, circulation, food/hydration, head injury, avoidable exposures |
| Psychological — Mind & habits | Stress response | Settling busy thoughts under pressure |
| Social — People & support | Learning & connection | New learning and trusted connection |
| Spiritual — Purpose & momentum | Meaning | Purpose and positive routines |

- Planning questions (best time, pace, support, weekly goal) stay separate and unscored, as the framework requires.
- Every reworded question keeps its `// ref BH-xx` comment; the wording change is recorded in the matching rows of `docs/brain-health-reference-log.md` so tracing stays accurate.
- No practitioner, clinic or programme name appears anywhere in the app or the log's question column.

## Version and progress handling

- Question IDs, option values and scores are unchanged, so `ASSESSMENT_SCHEMA_VERSION` stays at 4 — this avoids wiping anyone's half-finished answers for a wording-only change. The log's change-control note records the wording update instead.

## Technical details

- Edit only `title` (and where needed `subtitle`) strings in `src/data/launchAssessmentBanks.ts`, plus the matching "Exact app question" rows in `docs/brain-health-reference-log.md`. No logic, scoring, or schema changes.
- Typecheck after the edit; spot-check the questions on a phone-size screen.
