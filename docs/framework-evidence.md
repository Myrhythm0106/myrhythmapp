# MYRHYTHM — Evidence Basis

**Purpose:** record the published research domain behind each letter so any user-facing
wording can be traced back to a source. Binding alongside `docs/claims-policy.md`.

**Positioning rule:** MyRhythm's framework is *compatible with, and informed by*, established
brain-health programmes and public behavioural-science literature. The eight words, their
order and the way the app applies them are MyRhythm's own. We do not reproduce, rename or
teach any third party's curriculum.

**Attribution rule:** no individual practitioner or named programme is cited inside the
product. The founder's certification in an external brain-health programme may be stated in
founder, sales and partnership material — never as an in-app endorsement, and never in a way
that implies that programme endorses MyRhythm.

## The eight letters

| Letter | Word | Evidence domain | Representative sources |
| --- | --- | --- | --- |
| M | Mindset | Growth mindset, self-efficacy | Dweck, *Mindset* (2006); Bandura, *Self-Efficacy* (1997) |
| Y | Yes to Reality | Acceptance-based behaviour change; honest baselining | Hayes et al., ACT literature; goal-setting baseline research (Locke & Latham) |
| R | Rhythm | Circadian and ultradian variation in alertness and performance | Schmidt et al., *Cogn Neuropsychol* (2007) on time-of-day and cognition |
| H | Harness Support | Social connection and follow-through | Holt-Lunstad et al., *PLoS Med* (2010); *Perspect Psychol Sci* (2015) |
| Y | Your Victories | Progress principle; small-win reinforcement | Amabile & Kramer, *The Progress Principle* (2011) |
| T | Transform | Implementation intentions; friction reduction | Gollwitzer, *Am Psychol* (1999); Gollwitzer & Sheeran meta-analysis (2006) |
| H | Heal | Sleep, movement, nutrition and rest as daily performance inputs | Walker, *Why We Sleep* (2017); WHO physical-activity guidance (2020) |
| M | Meaning | Purpose and values-based goal persistence | Ryan & Deci, self-determination theory; Steger, meaning-in-life research |

## Wording constraints

Every user-facing line derived from this table must:

1. Stay inside the permitted claim domains — confidence, identity, behaviour, quality of life.
2. Avoid attaching a clinical outcome verb (improve / treat / reduce / cure / prevent) to a
   medical noun.
3. Quote no effect size, percentage or outcome promise.
4. Sit alongside the standard disclaimer wherever an outcome is described.

## Canonical implementation

`src/launch/framework/myrhythm.ts` is the single source of truth. The framework explainer,
the assessment letter strip, the letter insights and the MyRHYTHM-G growth states all read
from it. Changing a word there changes it everywhere; update this document in the same change.
