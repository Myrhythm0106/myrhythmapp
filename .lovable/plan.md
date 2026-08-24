# MYRHYTHM: One Framework, Evidence-Anchored

Make the eight MYRHYTHM letters stand for concepts that each have published scientific
support, while the *sequence, wording and application* stay unmistakably MyRhythm's own.
Mindset stays first — it is the load-bearing letter.

## Decisions locked

- **Compatible but proprietary.** MyRhythm uses its own words and order. We state that the
  framework is "compatible with, and informed by, established brain-health programmes" —
  we do not reproduce, rename or teach anyone else's curriculum.
- **No named person in-app.** Dr Amen is not named anywhere in the product. Named
  attribution, where the founder's certification is relevant, lives in founder/sales
  material only, not user-facing screens.
- **One explainer surface.** The framework tooltip is the only place the evidence basis is
  described. No new "science" sections elsewhere.
- **Redesigned eight letters**, each anchored to a named, citable research domain.

## The eight letters (proposed)

| Letter | Word | Evidence domain behind it |
| --- | --- | --- |
| M | **Mindset** | Growth-mindset and self-efficacy research (Dweck; Bandura) |
| Y | **Yes to Reality** | Acceptance-based behaviour change; honest baselines improve goal attainment |
| R | **Rhythm** | Circadian and ultradian variation in alertness and performance |
| H | **Harness Support** | Social connection as a predictor of follow-through and wellbeing (Holt-Lunstad) |
| Y | **Your Victories** | Progress principle; small-win reinforcement (Amabile & Kramer) |
| T | **Transform** | Implementation intentions and friction reduction (Gollwitzer) |
| H | **Heal** | Sleep, movement, nutrition, rest as daily performance inputs |
| M | **Meaning** | Purpose and values-based goal persistence |

Each letter carries: the word, a one-line plain-English meaning, a one-line "why this is
here" evidence note, and a source label. No effect sizes, no outcome promises.

## Single source of truth

Today the acronym is defined three different times with conflicting words
(`FrameworkInfoSheet.tsx`, `MyRhythmFrameworkDisplay.tsx`, `growth/states.ts`). That gets
consolidated:

- New `src/launch/framework/myrhythm.ts` holds the canonical eight entries plus their
  evidence notes.
- `FrameworkInfoSheet.tsx`, the assessment letter strip, `myrhythmLetterInsights.ts` and
  the MyRHYTHM-G growth states all read from it.
- The legacy onboarding display (`MULTIPLY` variant) is retired to the archive rather than
  deleted, per the no-delete rule.

## Guardrails

Every evidence note passes the existing `docs/claims-policy.md` checklist: claims stay in
confidence, identity, behaviour and quality of life; no clinical outcome verb attached to a
medical noun; the standard disclaimer stays at the foot of the explainer. A short
`docs/framework-evidence.md` records the citation behind each letter so any wording can be
traced later.

## Memory Bridge note

You're right that record → accurate extraction → editable table → agreed dates → into the
schedule is the game-changing chain. That pipeline already exists end to end
(`LaunchMemoryBridge` → `extract-acts-incremental` → `ActionsTableView` with editable
start/finish/due-in → calendar commit). This plan does not touch it. If you want a
dedicated accuracy-and-polish pass on that chain, say the word and I'll plan it separately
so it doesn't get diluted here.

## Technical summary

- New: `src/launch/framework/myrhythm.ts`, `docs/framework-evidence.md`
- Updated: `FrameworkInfoSheet.tsx`, `MyRhythmStrip.tsx`, `src/data/myrhythmLetterInsights.ts`,
  `src/data/launchAssessmentBanks.ts` (letter/word labels only), `src/launch/growth/states.ts`
  (names re-derived from the canonical list; the `growth_letter` enum values M1…M2 are unchanged,
  so no database migration is needed)
- Archived: `src/components/onboarding/steps/rhythm/MyRhythmFrameworkDisplay.tsx`
- Removed: the named references to Dr Amen and Dr Caroline Leaf in `FrameworkInfoSheet.tsx`
