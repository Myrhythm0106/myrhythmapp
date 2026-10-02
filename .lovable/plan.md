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

## Technical details

- Edit only `title` (and where needed `subtitle`) strings in `src/data/launchAssessmentBanks.ts`; no logic, scoring, or schema changes.
- Typecheck after the edit; spot-check the questions on a phone-size screen.
