# My Snapshot as a consulting-grade report

## The idea
The report should read like a short report a top consulting firm would hand you: one clear summary up front, evidence underneath, ranked recommendations, and then a decision that's yours to make. Every line comes from the person's own answers. The free report gives a real "wow". Membership unlocks the full plan behind it.

```text
1. Executive summary        (one screen, the "wow")
2. My priority areas        (ranked, I choose)
3. The detail behind it     (one card per area, from my answers)
4. Prove it now             (catch one real thing)
5. What's free / what unlocks (honest choice, max 3 options)
```

## 1. Executive summary (first screen, no scrolling)
- **Headline finding** in my own words, built from my answers. For example: *"I'm losing what's agreed after appointments, and slips are costing me confidence. My clearest hours are 9 to 11."*
- **Three key findings**, one each for Remembered, Reliable and Resilient. Each has a level (Strong / Building / Needs support) and a one-line "because I said...".
- **The biggest opportunity:** one sentence on where support will make the most difference first.
- **"What this could change for me in 3 weeks":** three concrete outcomes, written without medical claims.
- A short confidence note: *"Based on 11 answers. The Full Picture adds 20 more for a sharper read."*

## 2. My priority areas, ranked (we recommend, I decide)
- MyRhythm scores 6 to 8 areas from the answers (for example: remembering conversations, starting tasks, energy dips, sleep and rest, stress and inner voice, staying organised, support from others, meaning and progress).
- They're shown as a ranked list: **#1 Recommended first**, #2, #3, and so on. Each area shows:
  - the impact on my day (High / Medium / Low)
  - how easy a quick win is
  - "why this is ranked here", linked to my answers
- **I choose:** I tap up to 3 areas to work on. I can accept the recommended order or reorder it. My choice becomes my first focus on Home and shapes the 3-week plan.
- A 2x2 "impact vs effort" grid (quick wins, big moves, later, maybe) gives the consulting look. It's simple, labelled and readable on a phone.

## 3. The detail behind it (expandable, one card per area)
For each of the top areas:
- **What I told MyRhythm:** my answers, quoted back.
- **What this usually means day to day:** general, non-clinical.
- **What MyRhythm will do:** two or three specific actions (capture, plan in my clear hours, reminders, Support Circle).
- **Locked for members:** the full week-by-week plan for this area, shown as a blurred preview with a clear "included with membership" label. It's visible but not a trap.

The eight MYRHYTHM letters and the score move into a "My full picture" appendix, labelled "a starting point, not a test".

## 4. Prove it now
The existing "What can't I afford to forget this week?" step, linked to my #1 area. I save one real item into my clearest time tomorrow with one tap.

## 5. The honest choice (3 options)
- **Keep going free:** this report, my chosen priorities, the item I saved and my first 3 weeks.
- **Become a Founding Member (£10/mo for life):** the full plan for my chosen priorities, daily follow-through and Support Circle. The offer names my #1 area.
- **Go to Home.**

## Guardrails
- First-person voice, plain words and short sentences, even though the structure is consulting-style.
- No diagnosis, no medical claims, no practitioner names. "Not a test or a diagnosis" stays visible.
- Recommendations are suggestions. The person always decides, and nothing is saved without a tap.
- Large tap targets, max 3 primary choices per screen, and the priority choice is capped at 3.

## Technical
- New `src/launch/compass/priorityAreas.ts`:
  - maps answers to areas with impact and effort scores, a reason line and quoted answers
  - provides `rankAreas(answers)` and `buildExecutiveSummary(answers)`
  - tests assert concrete rankings for sample answer sets
- New components in `src/components/launch/report/`:
  - `ExecutiveSummary`
  - `PriorityRanking` (choose up to 3, reorder)
  - `ImpactEffortGrid`
  - `AreaDetailCard` (with a locked member preview)
- Save chosen priorities to device-local storage per user, and read them on Home for "first focus". Cloud sync waits for the pending database approval.
- `src/pages/launch/LaunchWelcome.tsx`:
  - reorder into the five sections above
  - mount `CatchOneThing` in section 4
  - move the score and letter bars into the appendix
  - make the offer line use the #1 chosen area
- Verify signed in, end to end: answer the questions, read the summary, choose priorities, save one item, see it on Calendar and Home. Check 320px, 393px and the 834px tablet.
