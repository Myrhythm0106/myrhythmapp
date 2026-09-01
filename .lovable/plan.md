# Rhythm-Aware Scheduling + Founder Focus-Group Readiness

## What this plan covers

1. Finish the rhythm-aware scheduling work already started (the migration you were
   asked to approve, plus the UI wiring).
2. The short must-do list before a discreet founders focus group tests externally.

## Part 1 — Rhythm-aware scheduling (the change you're approving)

The MYRHYTHM assessment already asks about rhythm, focus length and energy drains —
but nothing uses those answers. This connects them:

- **Database:** add six columns to `user_schedule_preferences` (`best_window_enabled`,
  `best_window_start`, `best_window_end`, `focus_block_minutes`,
  `priority_levels_by_type`, `learned_adjustments`). Non-destructive; existing rows
  keep working with sensible defaults.
- **Assessment → preference:** when the assessment completes, derive "My Best Window"
  (e.g. mornings, roughly 09:00–11:30) and store it. Already built:
  `productivityWindow.ts`, `cognitiveCapital.ts`, pillar scoring in the assessment banks.
- **One switch, on by default:** Settings → "Suggest times that suit my rhythm."
  One tap off, one tap back on. If it's off, the app behaves exactly as today.
- **Advice, never a gate:** out-of-window times are always allowed. A quiet note says
  "This sits outside your best window — Keep this time / Show best times." Stakeholder
  availability and hard deadlines always win; per-event-type priorities (Meetings =
  people first, Focus = my window first, Admin = deadline first) are pre-filled so the
  user never has to configure anything.
- **Report:** the results report shows the four-pillar view (Biological /
  Psychological / Social / Spiritual) and the "My Best Window" card.

Files touched: `LaunchAssessment.tsx` (save derived window), `useBrainHealthyPrefs.ts`
(read/write new fields), `smartScheduler.ts` (window-aware ranking + honest labels),
`BrainHealthySettingsCard.tsx` (the one switch + window display), `LaunchWelcome.tsx`
(pillar bars + best-window card).

## Part 2 — Must-haves before external founders testing (top 5)

1. **Finish this rhythm work + run the migration** (it's the only pending approval).
2. **Real-device smoke pass:** record → extract → commit → calendar on an iPhone and
   an Android, end to end, including the 3-tap capture path and app-switch recovery.
3. **Payment path verified in Stripe test mode** for one full signup → subscribe →
   login journey (the redirect loop was fixed once; it needs a clean re-test).
4. **Support Circle permission audit:** confirm a supporter sees only what they were
   explicitly shared, and nothing else — this is the trust boundary.
5. **Home-screen simplification pass:** the max-3-choices rule applied strictly, so a
   tired or cognitively loaded user lands and instantly knows the one next thing.

Nice-to-haves that can wait until after the focus group: offline read-only shell,
automated smoke tests, founding-feedback triage dashboard.

## Honest rating (as it stands today)

- **Concept and differentiation:** 9/10. The Discharge Cliff + follow-through-gap
  framing, Memory Bridge → Next Step Summary → calendar chain, and traceability codes
  are genuinely distinctive. Nothing in the consumer market does this chain.
- **Engineering reliability:** 7/10. The capture safety net (IndexedDB segments,
  recovery, retention countdowns) is strong. Extraction and mobile recording are the
  areas that have needed the most fixes — hence item 2 above.
- **Design/polish:** 7/10. Good bones (Emerald Prestige, glass, report); a final
  consistency and declutter pass is what separates it from an Apple-standard feel.
- **External-test readiness:** ~85%. After the five items above, yes — ready for a
  discreet founders group of 5–15 people.

Would Amazon or Apple "buy it as it is"? No acquirer buys an app as-is at this stage —
they buy proof: a retained cohort, usage data, and a defensible category (Memory-First
Design). What this plan does is make the product tight enough to generate that proof.
That is the honest answer.
